// Puts DUMMY accounts and sample requests into the LOCAL test database, so you can click through the demo.
// Run:  pnpm dev:db   (in its own terminal)   then   pnpm demo:seed
// It refuses to run on any database that is not on this computer. Everything here is made up.
// To remove it again: pnpm e2e:clean
import {
  E2E_ADMIN_ID,
  E2E_METHOD_ID,
  createPaidRequest,
  createSentRequest,
  ensureTestAdmin,
  ensureTestService,
  testSql,
} from "../tests/e2e/helpers";

const STAFF_ID = "77777777-7777-4777-8777-777777777777";

async function main() {
  await ensureTestService();
  await ensureTestAdmin();

  const sql = testSql();
  try {
    // Friendlier names for the demo (the test service and payment method are made up).
    await sql`update services set name = 'Sample service: monthly bookkeeping', description = 'A made-up service for the demo.' where slug = 'test-service-e2e'`;
    await sql`update payment_methods set name = 'GCash' where id = ${E2E_METHOD_ID}`;
    await sql`update profiles set full_name = 'Sample Owner' where id = ${E2E_ADMIN_ID}`;
    await sql`insert into profiles (id, email, full_name, role, is_active)
              values (${STAFF_ID}, 'demo-test+staff@example.com', 'Sample Staff', 'staff', true)
              on conflict (id) do update set role = 'staff', is_active = true`;
  } finally {
    await sql.end();
  }

  await createSentRequest("submitted", "Ana Sample");
  await createSentRequest("under_review", "Ben Sample");
  await createSentRequest("waiting_for_client", "Carla Sample");
  await createSentRequest("in_progress", "Dan Sample");
  await createPaidRequest("Eva Sample");

  console.log(
    "Demo data is ready: dummy owner, dummy staff, 1 service, 1 payment method, 5 sample requests.",
  );
  console.log("Owner sign-in: http://localhost:3000/admin  (2-step code in this mode: 000000)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
