const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Missing Supabase server environment variables."
  );
  process.exit(1);
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

app.get("/", (req, res) => {
  res.json({
    message: "Bindra Hosiery admin server is running",
  });
});

/* =========================
   VERIFY ADMIN
========================= */

async function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    res.status(401).json({
      error: "Authorization token required.",
    });

    return null;
  }

  const token = authHeader
    .substring(7)
    .trim();

  if (!token) {
    res.status(401).json({
      error: "Authorization token is missing.",
    });

    return null;
  }

  const {
    data: { user },
    error: userError,
  } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    console.error(
      "User verification error:",
      userError?.message
    );

    res.status(401).json({
      error:
        "Invalid or expired login session.",
    });

    return null;
  }

  const {
    data: roleData,
    error: roleError,
  } =
    await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

  if (roleError) {
    console.error(
      "Role lookup error:",
      roleError.message
    );

    res.status(403).json({
      error:
        "Unable to verify admin permissions.",
    });

    return null;
  }

  if (roleData?.role !== "admin") {
    res.status(403).json({
      error:
        "Only the Owner/Admin can perform this action.",
    });

    return null;
  }

  return user;
}

/* =========================
   CREATE MANAGER
========================= */

app.post("/create-manager", async (req, res) => {
  try {
    const adminUser = await verifyAdmin(
      req,
      res
    );

    if (!adminUser) {
      return;
    }

    const {
      email,
      password,
      name,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error:
          "Email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters.",
      });
    }

    const cleanEmail = email.trim();
    const cleanName =
      name?.trim() || "";

    const {
      data: newUserData,
      error: createUserError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email: cleanEmail,
          password,
          email_confirm: true,
          user_metadata: {
            name: cleanName,
          },
        }
      );

    if (createUserError) {
      console.error(
        "Manager Auth creation error:",
        createUserError.message
      );

      return res.status(400).json({
        error: createUserError.message,
      });
    }

    const newUser =
      newUserData.user;

    if (!newUser) {
      return res.status(500).json({
        error:
          "Manager account was not created.",
      });
    }

    const {
      error: roleInsertError,
    } =
      await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: newUser.id,
          role: "manager",
        });

    if (roleInsertError) {
      console.error(
        "Manager role creation error:",
        roleInsertError.message
      );

      await supabaseAdmin.auth.admin.deleteUser(
        newUser.id
      );

      return res.status(500).json({
        error:
          "Manager account could not be created.",
      });
    }

    // Create default permissions
    const {
      error: permissionError,
    } =
      await supabaseAdmin
        .from("manager_permissions")
        .insert({
          user_id: newUser.id,
          products: false,
          orders: false,
          categories: false,
          analytics: false,
        });

    if (permissionError) {
      console.error(
        "Manager permission creation error:",
        permissionError.message
      );

      // Roll back role and Auth account
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", newUser.id);

      await supabaseAdmin.auth.admin.deleteUser(
        newUser.id
      );

      return res.status(500).json({
        error:
          "Manager permissions could not be created.",
      });
    }

    console.log(
      "Manager created successfully:",
      newUser.email
    );

    return res.status(201).json({
      message:
        "Manager created successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: cleanName,
        role: "manager",
      },
    });
  } catch (error) {
    console.error(
      "Create manager error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong while creating manager.",
    });
  }
});

/* =========================
   GET ALL MANAGERS
========================= */

app.get("/managers", async (req, res) => {
  try {
    const adminUser = await verifyAdmin(
      req,
      res
    );

    if (!adminUser) {
      return;
    }

    const {
      data: managerRoles,
      error: rolesError,
    } =
      await supabaseAdmin
        .from("user_roles")
        .select(
          "user_id, role, created_at"
        )
        .eq("role", "manager")
        .order("created_at", {
          ascending: false,
        });

    if (rolesError) {
      console.error(
        "Manager roles loading error:",
        rolesError.message
      );

      return res.status(500).json({
        error:
          "Unable to load managers.",
      });
    }

    const managers = [];

    for (const manager of managerRoles || []) {
      const {
        data: authUserData,
        error: authUserError,
      } =
        await supabaseAdmin.auth.admin.getUserById(
          manager.user_id
        );

      if (authUserError) {
        console.error(
          "Manager Auth lookup error:",
          authUserError.message
        );

        continue;
      }

      const authUser =
        authUserData?.user;

      const {
        data: permissionData,
        error: permissionError,
      } =
        await supabaseAdmin
          .from("manager_permissions")
          .select(
            "products, orders, categories, analytics"
          )
          .eq("user_id", manager.user_id)
          .single();

      if (permissionError) {
        console.error(
          "Permission loading error:",
          permissionError.message
        );
      }

      managers.push({
        user_id: manager.user_id,
        email:
          authUser?.email || "",
        name:
          authUser?.user_metadata?.name ||
          "",
        role: manager.role,
        created_at:
          manager.created_at,

        products:
          permissionData?.products ??
          false,

        orders:
          permissionData?.orders ??
          false,

        categories:
          permissionData?.categories ??
          false,

        analytics:
          permissionData?.analytics ??
          false,
      });
    }

    return res.json({
      managers,
    });
  } catch (error) {
    console.error(
      "Load managers error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong while loading managers.",
    });
  }
});

/* =========================
   UPDATE MANAGER PERMISSION
========================= */

app.post(
  "/update-manager-permission",
  async (req, res) => {
    try {
      const adminUser =
        await verifyAdmin(req, res);

      if (!adminUser) {
        return;
      }

      const {
        user_id,
        permission,
        value,
      } = req.body;

      const allowedPermissions = [
        "products",
        "orders",
        "categories",
        "analytics",
      ];

      if (
        !user_id ||
        !permission ||
        typeof value !== "boolean"
      ) {
        return res.status(400).json({
          error:
            "Invalid permission request.",
        });
      }

      if (
        !allowedPermissions.includes(
          permission
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid permission type.",
        });
      }

      const {
        data: managerRole,
        error: managerRoleError,
      } =
        await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user_id)
          .single();

      if (
        managerRoleError ||
        managerRole?.role !== "manager"
      ) {
        return res.status(404).json({
          error:
            "Manager account not found.",
        });
      }

      const {
        data: existingPermission,
        error: permissionCheckError,
      } =
        await supabaseAdmin
          .from("manager_permissions")
          .select("user_id")
          .eq("user_id", user_id)
          .maybeSingle();

      if (permissionCheckError) {
        console.error(
          "Permission record check error:",
          permissionCheckError.message
        );

        return res.status(500).json({
          error:
            "Unable to check manager permissions.",
        });
      }

      if (!existingPermission) {
        const {
          error: insertError,
        } =
          await supabaseAdmin
            .from("manager_permissions")
            .insert({
              user_id,
              products:
                permission === "products"
                  ? value
                  : false,
              orders:
                permission === "orders"
                  ? value
                  : false,
              categories:
                permission ===
                "categories"
                  ? value
                  : false,
              analytics:
                permission === "analytics"
                  ? value
                  : false,
            });

        if (insertError) {
          console.error(
            "Permission insert error:",
            insertError.message
          );

          return res.status(500).json({
            error:
              "Unable to save manager permission.",
          });
        }
      } else {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from("manager_permissions")
            .update({
              [permission]: value,
            })
            .eq("user_id", user_id);

        if (updateError) {
          console.error(
            "Permission update error:",
            updateError.message
          );

          return res.status(500).json({
            error:
              "Unable to update manager permission.",
          });
        }
      }

      return res.json({
        message:
          "Manager permission updated successfully.",
      });
    } catch (error) {
      console.error(
        "Update permission error:",
        error
      );

      return res.status(500).json({
        error:
          "Something went wrong while updating permission.",
      });
    }
  }
);

app.listen(5001, () => {
  console.log(
    "Bindra Hosiery admin server running on port 5001"
  );
});