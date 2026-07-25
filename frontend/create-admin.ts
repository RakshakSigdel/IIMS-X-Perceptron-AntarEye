import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const email = "admin@example.com";
  const password = "Admin@123";
  const fullName = "Admin";
  const role = "admin";

  // Check if the user already exists
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingUser = users.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  let authUserId: string;

  if (existingUser) {
    console.log("✔ Admin user already exists.");
    authUserId = existingUser.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw error;
    }

    console.log("✔ Admin user created.");

    authUserId = data.user.id;
  }

  const { error: profileError } = await supabase.from("user_profiles").upsert(
    {
      auth_user_id: authUserId,
      role: role,
      full_name: fullName,
      email,
    },
    {
      onConflict: "auth_user_id",
    },
  );

  if (profileError) {
    throw profileError;
  }

  console.log("✔ Admin profile ready.");
}

main()
  .then(() => {
    console.log("✔ Bootstrap complete.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
