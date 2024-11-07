document
  .getElementById("driver-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const vehicle = document.getElementById("vehicle").value;
    const noplate = document.getElementById("noplate").value;

    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, vehicle, noplate }),
      });
      const result = await response.json();
      setalert(result.success ? "Driver added!" : "Error adding driver");
      document.getElementById("driver-form").reset();
      loadDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  });

async function loadDrivers() {
  try {
    const response = await fetch("/api/drivers");
    if (!response.ok) throw new Error("Failed to fetch drivers list");
    const drivers = await response.json();
    console.log(drivers);
    const table = document.getElementById("drivers-table");
    table.innerHTML = drivers
      .map(
        (d) => `
                <tr>
                  <td>${d.name}</td>
                  <td>${d.phone}</td>
                  <td>${d.vehicle}</td>
                  <td>${d.noplate}</td>
                  <td>${d.totalLoad}</td>
                  <td><a href="${d.qrLink}" download><img src="${d.qrLink}" width="50"></a></td>
                  <td>
                    <a href="/api/drivers/view/${d._id}" class="a-btn btn-warning">View</a>
                    <button class="btn btn-success btn-sm" onclick="getDriver('${d._id}')">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDriver('${d._id}')">Delete</button>
                  </td>
                </tr>
              `
      )
      .join("");
  } catch (error) {
    console.error("Error loading drivers list:", error);
    document.getElementById(
      "drivers-table"
    ).innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading drivers list</td></tr>`;
  }
}

async function deleteDriver(id) {
  try {
    await fetch(`/api/drivers/${id}`, { method: "DELETE" });
    setalert("User Deleted....!");
    loadDrivers();
  } catch (error) {
    console.error("Error deleting driver:", error);
  }
}

loadDrivers();

const add_card = document.querySelector(".add-card");
const add_btn = document.querySelector("button.add");
const cancel_btn = document.querySelector("button.cancel");
const refresh = document.querySelector("button.refresh");
const update_card = document.querySelector(".update-card");
const update_cancel = document.querySelector(".ucancel");

add_btn.addEventListener("click", () => {
  add_card.classList.add("active");
});

update_cancel.addEventListener("click", () => {
  update_card.classList.remove("active");
});

cancel_btn.addEventListener("click", () => {
  add_card.classList.remove("active");
});

refresh.addEventListener("click", () => {
  loadDrivers();
});

async function getDriver(driverId) {
  try {
    const res = await fetch(`/api/drivers/${driverId}`);
    const result = await res.json();
    if (res.ok) {
      document.getElementById("id").value = driverId;
      document.getElementById("uname").value = result.message.name;
      document.getElementById("uphone").value = result.message.phone;
      document.getElementById("uvehicle").value = result.message.vehicle;
      document.getElementById("unoplate").value = result.message.noplate;
      document.getElementById("uload").value = result.message.totalLoad;
      update_card.classList.add("active");
      console.log(result.message);
    }
  } catch (err) {
    console.log(err);
  }
}

document
  .getElementById("update-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const driverId = document.getElementById("id").value;
    const name = document.getElementById("uname").value;
    const phone = document.getElementById("uphone").value;
    const vehicle = document.getElementById("uvehicle").value;
    const noplate = document.getElementById("unoplate").value;
    const totalLoad = document.getElementById("uload").value;

    try {
      const response = await fetch("/api/drivers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId,
          name,
          phone,
          vehicle,
          noplate,
          totalLoad,
        }),
      });
      const result = await response.json();
      console.log(result.success ? "Driver Updated!" : "Error Updating driver");
      console.log(result.message);
      setalert("Updated successfully...!");
      update_card.classList.remove("active");
      document.getElementById("update-form").reset();
      loadDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  });

function setalert(message) {
  let div = document.createElement("div");

  div.className = "alert-msg";

  div.innerHTML = `
        <div class="header">
          <h6>Message</h6>
          <p class="text">${message}</p>
        </div>
      `;
  document.querySelector(".alert-box").appendChild(div);

  setTimeout(() => {
    document.querySelector(".alert-box").removeChild(div);
  }, 5001);
}

// setInterval(() => {
//   loadDrivers();
// }, 1000);
