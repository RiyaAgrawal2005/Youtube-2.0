export function getLoggedInUserEmail(): string | null {
  try {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      alert("Please log in.");
      return null;
    }

    const userData = JSON.parse(userDataString);
    if (userData && userData.email) {
      console.log("✅ Logged in as:", userData.email);
      return userData.email;
    } else {
      alert("User data is incomplete. Please log in again.");
      return null;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    alert("Invalid user data. Please log in again.");
    return null;
  }
}
