import { supabase } from "./utils/supabase/supabase";
import { prisma } from "./utils/prismaClient";

export async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  
  if (error) {
    console.error("Signup error:", error);
    return { success: false, error }; // Ensure function always returns something
  }

  console.log("Signup successful:", data);

  return { success: true, data }; 
}

export const getUserLevel = async (email : string)=>{
  const { data, error } = await supabase
  .from('users-data')
  .select('userLevel')
  .eq('email', email)
  if (error) {
    console.error("Couldn't  user level, error:", error);
    return new Error(`Couldn't get user level: ${error.message}`);
  }
  return data;
}

export const getProfileUrl = async (email : string)=>{
  const { data, error } = await supabase
  .from('users-data')
  .select('linkedInUrl')
  .eq('email', email)
  if (error) {
    console.error("Couldn't  user level, error:", error);
    return new Error(`Couldn't get user level: ${error.message}`);
  }
  return data;
}

export const addUserToDatabase = async (email: string, userLevel : string, linkedInUrl : string) => {
  const { data, error } = await supabase
    .from("users-data")
    .insert({
      email,
      userLevel,
      linkedInUrl
    })
    .select();

  if (error) {
    console.error("Couldn't add user to the database, error:", error);
    return new Error(`Couldn't add user to the database: ${error.message}`);
  }

  console.log("User added to the database successfully: ", data);
  return data; 
}


export async function signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error("Signin error:", error);
      return { success: false, error }; // Ensure function always returns something
    }
  
    console.log("Signin successful:", data);

    const profileUrl = await getProfileUrl(email);
    const userLevel = await getUserLevel(email);

    //@ts-expect-error profileUrl is an array
    await chrome.storage.local.set({profileUrl : profileUrl[0]?.linkedInUrl})

    console.log("profile URL : ", profileUrl)

    return { success: true, data }; // Return success response
  }
  

  export async function signOut(){
    const response = await supabase.auth.signOut();

    console.log("response : ", response)
    if(response.error){
      console.error("error : ", response.error)
      return Error("Error signing out user")
    }

    console.log("user signed out successfully")
    return response
  }