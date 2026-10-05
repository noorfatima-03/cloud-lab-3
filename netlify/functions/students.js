exports.handler = async function (event) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

    // Check that Netlify has the required environment variables
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Supabase environment variables are not configured."
            })
        };
    }

    try {
        // GET: Retrieve all student records
        if (event.httpMethod === "GET") {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/students?select=*&order=id.asc`,
                {
                    method: "GET",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    statusCode: response.status,
                    body: JSON.stringify({
                        error: data.message || "Database error."
                    })
                };
            }

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
        }

        // POST: Add a new student record
        if (event.httpMethod === "POST") {
            const student = JSON.parse(event.body);

            // Check that all fields are provided
            if (
                !student.name ||
                !student.roll_number ||
                !student.course
            ) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: "All fields are required."
                    })
                };
            }

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/students`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=representation"
                    },
                    body: JSON.stringify({
                        name: student.name,
                        roll_number: student.roll_number,
                        course: student.course
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    statusCode: response.status,
                    body: JSON.stringify({
                        error: data.message || "Database error."
                    })
                };
            }

            return {
                statusCode: 201,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data[0])
            };
        }

        // Reject unsupported HTTP methods
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Method not allowed."
            })
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
