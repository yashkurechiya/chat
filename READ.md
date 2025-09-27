# Alignbox Chat Application Assignment

A full-stack, real-time chat application built as a technical assignment for an internship role at Alignbox. This project features a live chat interface, message persistence with a MySQL database, and an anonymous messaging mode.

## 🚀 Live Demo

**[View the live application here](https://chat-bkz3.onrender.com)**

---

## 📸 Screenshot

*Add a screenshot of your running application here. You can drag and drop an image onto the GitHub file editor.*

![Screenshot of the chat application UI](./screenshot.png)

---

## ✨ Features

* **Real-Time Messaging:** Instantly send and receive messages with other users using Socket.IO.
* **Message History:** Chat history is saved to a database and loaded upon entry.
* **Anonymous Mode:** A toggle allows users to send messages anonymously.
* **Dynamic Usernames:** Users are prompted for a name, which is used for the session.
* **Secure Connections:** Enforces SSL/TLS for secure communication with the database.
* **Responsive UI:** A clean user interface built to match the provided Figma design.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Real-Time Engine:** Socket.IO
* **Database:** MySQL (Hosted on TiDB Cloud)
* **Deployment:** Render (Web Service)

---

## ⚙️ Setup and Run Locally

To run this project on your own machine, follow these steps.

### **Prerequisites**

* [Node.js](https://nodejs.org/en/) (v18 or later recommended)
* A local MySQL server or a cloud database instance.

### **Installation**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/alignbox-chat-assignment.git](https://github.com/your-username/alignbox-chat-assignment.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd alignbox-chat-assignment
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**
    * Create a file named `.env` in the root of the project.
    * Copy the contents of `.env.example` (if you have one) or add the following variables, replacing the values with your local database credentials:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=your_database_password
        DB_NAME=alignbox_chat
        PORT=3000
        ```

5.  **Set up the database:**
    * Make sure your MySQL server is running.
    * Execute the SQL script provided in the project to create the `messages` table.

6.  **Start the server:**
    ```sh
    npm start
    ```
    The application should now be running at `http://localhost:3000`.

---

## 📄 License

This project is licensed under the MIT License.