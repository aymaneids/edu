import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProfileView from "@/components/profile/ProfileView";
import ProfileForm from "@/components/auth/ProfileForm";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout activeNavItem="profile">
      <div className="container mx-auto py-6">
        {isEditing ? (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="mb-4 text-sm font-medium text-primary hover:underline"
            >
              ← Back to Profile
            </button>
            <ProfileForm />
          </div>
        ) : (
          <ProfileView onEditProfile={() => setIsEditing(true)} />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
