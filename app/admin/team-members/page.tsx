/**
 * Admin Team Members Management
 * Route: /admin/team-members
 * Create, edit, and manage team member profiles
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { TeamMember } from "@/types/team-member";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/admin/team-members");
      const data = await res.json();

      if (res.ok) {
        setTeamMembers(data.data || []);
      } else {
        toast.error("Failed to load team members");
      }
    } catch (error) {
      toast.error("Error loading team members");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setTitle("");
    setBio("");
    setImage("");
    setEmail("");
    setPhone("");
    setTwitter("");
    setLinkedin("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (member: TeamMember) => {
    setName(member.name);
    setTitle(member.title);
    setBio(member.bio);
    setImage(member.image || "");
    setEmail(member.email || "");
    setPhone(member.phone || "");
    setTwitter(member.twitter || "");
    setLinkedin(member.linkedin || "");
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !title.trim() || !bio.trim()) {
      toast.error("Name, title, and bio are required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/team-members/${editingId}`
        : "/api/admin/team-members";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          bio,
          image: image || undefined,
          email: email || undefined,
          phone: phone || undefined,
          twitter: twitter || undefined,
          linkedin: linkedin || undefined,
        }),
      });

      if (res.ok) {
        toast.success(
          editingId ? "Team member updated" : "Team member created",
        );
        fetchTeamMembers();
        handleReset();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save team member");
      }
    } catch (error) {
      toast.error("Error saving team member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;

    try {
      const res = await fetch(`/api/admin/team-members/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Team member deleted");
        fetchTeamMembers();
      }
    } catch (error) {
      toast.error("Error deleting team member");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="transition hover:text-green-500">
          Dashboard
        </Link>
        <span>→</span>
        <span className="font-medium text-gray-900">Team Members</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-2 text-gray-600">Manage your team profiles</p>
        </div>
        <button
          onClick={() => {
            handleReset();
            setShowForm(true);
          }}
          className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition hover:bg-green-600"
        >
          + New Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form - Left Column */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {editingId ? "Edit Member" : "New Member"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Lead Designer"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bio *
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description about the team member"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <hr className="my-3" />

                <div className="text-xs font-semibold text-gray-700 uppercase">
                  Contact Info
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <hr className="my-3" />

                <div className="text-xs font-semibold text-gray-700 uppercase">
                  Social Links
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@janesmith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/janesmith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Team Members Grid - Right Column */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          {teamMembers.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="mb-4 text-gray-500">No team members yet</p>
              <button
                onClick={() => {
                  handleReset();
                  setShowForm(true);
                }}
                className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition hover:bg-green-600"
              >
                + Add First Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Image */}
                  {member.image && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-24 w-24 rounded-full border-2 border-green-100 object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <h3 className="text-center text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-center text-sm font-medium text-green-600">
                    {member.title}
                  </p>

                  <p className="mt-3 line-clamp-2 text-center text-sm text-gray-700">
                    {member.bio}
                  </p>

                  {/* Contact Links */}
                  <div className="mt-4 flex justify-center gap-3 text-sm">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        Email
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={`https://twitter.com/${member.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
