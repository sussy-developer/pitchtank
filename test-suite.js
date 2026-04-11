async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log("🚀 Starting Backend Integration Tests...");
  let state = { founderId: null, investorId: null, startupId: null, dealId: null };

  try {
    // 1. Create a Founder
    console.log("\n[1] Creating a Founder User...");
    const founderRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: 'test_founder_' + Date.now(),
        email: `founder_${Date.now()}@test.com`,
        displayName: 'Test Founder',
        authProvider: 'email'
      })
    });
    const founderData = await founderRes.json();
    if (!founderData.success) throw new Error(JSON.stringify(founderData));
    state.founderId = founderData.data._id;
    console.log("✅ Founder created successfully:", state.founderId);

    // 2. Create an Investor
    console.log("\n[2] Creating an Investor User...");
    const investorRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: 'test_investor_' + Date.now(),
        email: `investor_${Date.now()}@test.com`,
        displayName: 'Test Investor',
        authProvider: 'email'
      })
    });
    const investorData = await investorRes.json();
    if (!investorData.success) throw new Error(JSON.stringify(investorData));
    state.investorId = investorData.data._id;
    console.log("✅ Investor created successfully:", state.investorId);

    // 3. Create a Startup
    console.log("\n[3] Creating a Startup...");
    const startupRes = await fetch(`${BASE_URL}/startups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        founderId: state.founderId,
        name: "Test AI Startup",
        tagline: "Automated testing for AI models.",
        category: "B2B SaaS",
        industry: "Artificial Intelligence",
        investmentNeeded: 500000,
        equityOffered: 10,
      })
    });
    const startupData = await startupRes.json();
    if (!startupData.success) throw new Error(JSON.stringify(startupData));
    state.startupId = startupData.data._id;
    console.log("✅ Startup created successfully:", startupData.data.name);

    // 4. Fetch Startups (Discovery Feed test)
    console.log("\n[4] Fetching Startups (Dashboard Feed)...");
    const getStartupsRes = await fetch(`${BASE_URL}/startups`);
    const getStartupsData = await getStartupsRes.json();
    if (!getStartupsData.success) throw new Error(JSON.stringify(getStartupsData));
    console.log(`✅ Fetched ${getStartupsData.data.length} startups from DB.`);

    // 5. Create a Deal (Investor makes offer)
    console.log("\n[5] Creating a Deal (Investor Offer)...");
    const dealRes = await fetch(`${BASE_URL}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: state.startupId,
        investorId: state.investorId,
        founderId: state.founderId,
        offerAmount: 400000,
        equityAsked: 12,
        terms: "Standard test term sheet"
      })
    });
    const dealData = await dealRes.json();
    if (!dealData.success) throw new Error(JSON.stringify(dealData));
    state.dealId = dealData.data.dealId; // Use custom dealId
    console.log("✅ Deal created successfully:", state.dealId);

    // 6. Update Deal Status (Founder accepts)
    console.log("\n[6] Updating Deal Status (Founder Accepts)...");
    const dealStatusRes = await fetch(`${BASE_URL}/deals/${state.dealId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' })
    });
    const dealStatusData = await dealStatusRes.json();
    if (!dealStatusData.success) throw new Error(JSON.stringify(dealStatusData));
    console.log("✅ Deal status updated to:", dealStatusData.data.status);

    console.log("\n🎉 All Tests Passed! The Backend, Database, and Endpoints are fully operational.");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
  }
}

runTests();