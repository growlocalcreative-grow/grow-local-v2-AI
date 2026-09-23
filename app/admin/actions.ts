"use server";

import { patchDocument, createDocument, deleteDocument, runQuery, getDocument } from "@/lib/firestore-server";
import { revalidatePath } from "next/cache";

/**
 * Server action to save content sections or site settings.
 * We pass the idToken from the client to authorize the REST API call.
 */
export async function saveContentAction(collection: string, docId: string, data: any, idToken: string) {
  try {
    await patchDocument(collection, docId, data, idToken);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(`Save error for ${collection}/${docId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to fetch subscribers using REST API.
 */
export async function getSubscribersAction(idToken: string) {
  try {
    const results = await runQuery("subscribers", "createdAt", "DESCENDING", idToken, "no-store");
    return { success: true, data: results };
  } catch (error: any) {
    console.error("Fetch subscribers error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to delete a subscriber.
 */
export async function deleteSubscriberAction(id: string, idToken: string) {
  try {
    await deleteDocument("subscribers", id, idToken);
    return { success: true };
  } catch (error: any) {
    console.error("Delete subscriber error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to fetch a document.
 */
export async function getDocumentAction(collection: string, docId: string) {
  try {
    const data = await getDocument(collection, docId, "no-store");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Server action for newsletter subscription.
 * Does not require idToken as per security rules.
 */
export async function subscribeAction(email: string) {
  try {
    const subscriberId = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
    await createDocument("subscribers", subscriberId, {
      email,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error: any) {
    console.error("Subscription error:", error);
    return { success: false, error: error.message };
  }
}
