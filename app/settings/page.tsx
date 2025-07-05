"use client";

import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const { user, loading, error, refresh } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errMsg, setErrMsg] = useState("");

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Please log in to access settings.</div>;

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrMsg("");
    setSuccess("");
    try {
      // Update user metadata (name/email) in Supabase auth
      let updateError = null;
      if (user) {
        // Update email if changed
        if (email !== user.email) {
          const { error } = await supabase.auth.updateUser({ email });
          if (error) updateError = error.message;
        }
        // Update full_name in user_metadata
        if (name !== user.user_metadata?.full_name) {
          const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
          if (error) updateError = error.message;
        }
        // Optionally update your users table as well
        const { error: dbError } = await supabase
          .from("users")
          .update({ full_name: name, email })
          .eq("id", user.id);
        if (dbError) updateError = dbError.message;
      }
      if (updateError) throw new Error(updateError);
      setSuccess("Profile updated successfully!");
      refresh();
    } catch (err: any) {
      setErrMsg(err.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrMsg("");
    setSuccess("");
    try {
      // Update password in Supabase auth
      if (user && password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error(error.message);
        setSuccess("Password changed successfully!");
      }
    } catch (err: any) {
      setErrMsg(err.message || "Error changing password.");
    } finally {
      setSaving(false);
    }
  }

  async function handleNotifSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrMsg("");
    setSuccess("");
    try {
      // Update notification preferences in users table
      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ notif_email: notifEmail, notif_sms: notifSMS })
          .eq("id", user.id);
        if (error) throw new Error(error.message);
      }
      setSuccess("Notification preferences updated!");
    } catch (err: any) {
      setErrMsg(err.message || "Error updating notifications.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl animate-fade-in mb-8">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-green-700">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-green-700">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow" disabled={saving}>Save Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-2xl animate-fade-in mb-8">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-green-700">New Password</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} required type="password" minLength={6} />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow" disabled={saving}>Change Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-2xl animate-fade-in mb-8">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNotifSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-green-700">Email Notifications</label>
              <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-green-700">SMS Notifications</label>
              <input type="checkbox" checked={notifSMS} onChange={e => setNotifSMS(e.target.checked)} />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow" disabled={saving}>Save Notifications</Button>
          </form>
        </CardContent>
      </Card>

      {(success || errMsg) && (
        <Alert className="w-full max-w-2xl mx-auto mb-8 animate-fade-in" variant={success ? "success" : "destructive"}>
          <AlertDescription>{success || errMsg}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="w-full max-w-2xl mx-auto mb-8 animate-fade-in" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
