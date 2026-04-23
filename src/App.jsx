const submit = async () => {
  try {
    const res = await fetch(API + "/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    console.log("SUBMIT RESPONSE:", res.status, data);

    if (!res.ok) {
      alert(data.error || "Submit failed");
      return;
    }

    alert("Application submitted!");
  } catch (err) {
    console.log("NETWORK ERROR:", err);
    alert("Backend not reachable");
  }
};
