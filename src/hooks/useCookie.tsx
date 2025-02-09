import { useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

/**
 * Custom hook to manage the user_id cookie.
 * Generates a UUID if the cookie doesn't exist and sets it.
 *
 * @returns {string} userId - The unique user identifier.
 */
const useCookie = () => {
  const COOKIE_NAME = "user_id";

  // Initialize userId state based on existing cookie or generate a new one
  const [userId, setUserId] = useState<string>(() => {
    // Retrieve the user_id from cookies
    let existingUserId = Cookies.get(COOKIE_NAME);

    if (!existingUserId) {
      // Generate a new UUID if it doesn't exist
      existingUserId = uuidv4();

      // Set the cookie with desired attributes
      Cookies.set(COOKIE_NAME, existingUserId, {
        expires: 365, // 1 year
        secure: true, // Send cookie over HTTPS only
        sameSite: "Lax", // CSRF protection
        path: "/", // Accessible throughout the site
        // HttpOnly cannot be set via JavaScript
      });
    }

    return existingUserId;
  });

  return userId;
};

export default useCookie;
