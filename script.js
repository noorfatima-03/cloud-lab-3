const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const message = document.getElementById("message");
const refreshButton = document.getElementById("refreshButton");


// Load students from the backend
async function loadStudents() {

    try {

        const response = await fetch("/.netlify/functions/students");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load students.");
        }

        studentTableBody.innerHTML = "";

        if (data.length === 0) {

            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="4">No student records found.</td>
                </tr>
            `;

            return;
        }

        data.forEach(student => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.roll_number}</td>
                <td>${student.course}</td>
            `;

            studentTableBody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        message.textContent =
            "Error loading records: " + error.message;

    }
}


// Add a new student
studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const rollNumber =
        document.getElementById("rollNumber").value.trim();
    const course =
        document.getElementById("course").value.trim();

    if (!name || !rollNumber || !course) {

        message.textContent =
            "Please fill in all fields.";

        return;
    }

    try {

        message.textContent = "Adding student...";

        const response = await fetch(
            "/.netlify/functions/students",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    roll_number: rollNumber,
                    course: course
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add student.");
        }

        message.textContent =
            "Student added successfully!";

        studentForm.reset();

        await loadStudents();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Error: " + error.message;
    }

});


// Refresh button
refreshButton.addEventListener("click", loadStudents);


// Load records when page opens
loadStudents();
