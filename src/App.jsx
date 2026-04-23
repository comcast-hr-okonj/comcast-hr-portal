const submit = async () => {
  try {
    console.log("SENDING FORM:", form);

    const res = await fetch(API + "/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (!res.ok) {
      alert(data.error || "Submit failed");
      return;
    }

    alert("Application submitted successfully!");
  } catch (err) {
    console.log("NETWORK ERROR:", err);
    alert("Backend not reachable");
  }
};
