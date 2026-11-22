
/* =====================================
   DAKSANET - BASIC JAVASCRIPT
===================================== */

// Load saved applications from localStorage

let applications = JSON.parse(
    localStorage.getItem("daksaNetApplications") || "[]"
);


// =====================================
// 1. DISPLAY APPLICATIONS
// =====================================

function displayApplications() {

    const table = document.getElementById("applicationTable");

    table.innerHTML = "";

    if (applications.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">No applications submitted yet.</td>
            </tr>
        `;

    } else {

        applications.forEach((app, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(app.name)}</td>
                <td>${escapeHTML(app.internship)}</td>
                <td>${escapeHTML(app.date)}</td>

                <td>
                    <select class="status-select"
                            data-index="${index}">

                        <option value="Pending"
                            ${app.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Approved"
                            ${app.status === "Approved" ? "selected" : ""}>
                            Approved
                        </option>

                        <option value="Rejected"
                            ${app.status === "Rejected" ? "selected" : ""}>
                            Rejected
                        </option>

                    </select>
                </td>
            `;

            table.appendChild(row);

        });

    }

    updateStatistics();
}


// =====================================
// 2. PREVENT HTML INJECTION
// =====================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// =====================================
// 3. SUBMIT APPLICATION
// =====================================

document.getElementById("applicationForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();

        const email = document.getElementById("studentEmail").value.trim();

        const course = document.getElementById("studentCourse").value.trim();

        const internship = document.getElementById("internshipChoice").value;

        if (!name || !email || !course || !internship) {
            return;
        }

        const application = {

            name: name,

            email: email,

            course: course,

            internship: internship,

            date: new Date().toLocaleDateString("en-IN"),

            status: "Pending"

        };

        applications.push(application);

        localStorage.setItem(
            "daksaNetApplications",
            JSON.stringify(applications)
        );

        displayApplications();

        document.getElementById("applicationForm").reset();

        document.getElementById("formMessage").textContent =
            "Your application has been submitted successfully!";

    });


// =====================================
// 4. UPDATE APPLICATION STATUS
// =====================================

document.getElementById("applicationTable")
    .addEventListener("change", function(event) {

        if (event.target.classList.contains("status-select")) {

            const index = event.target.dataset.index;

            applications[index].status = event.target.value;

            localStorage.setItem(
                "daksaNetApplications",
                JSON.stringify(applications)
            );

            updateStatistics();

        }

    });


// =====================================
// 5. UPDATE DASHBOARD STATISTICS
// =====================================

function updateStatistics() {

    const total = applications.length;

    const approved = applications.filter(
        app => app.status === "Approved"
    ).length;

    const pending = applications.filter(
        app => app.status === "Pending"
    ).length;

    const rejected = applications.filter(
        app => app.status === "Rejected"
    ).length;

    document.getElementById("totalInternships").textContent = "4";

    document.getElementById("totalApplications").textContent = total;

    document.getElementById("approvedApplications").textContent = approved;

    document.getElementById("reportTotal").textContent = total;

    document.getElementById("reportApproved").textContent = approved;

    document.getElementById("reportPending").textContent = pending;

    document.getElementById("reportRejected").textContent = rejected;

}


// =====================================
// 6. APPLY BUTTONS
// =====================================

document.querySelectorAll(".apply-link").forEach(button => {

    button.addEventListener("click", function() {

        document.getElementById("internshipChoice").value =
            this.dataset.internship;

    });

});


// =====================================
// 7. INITIALIZE WEBSITE
// =====================================

displayApplications();
