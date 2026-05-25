import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import { User, Settings, Lock, Edit2, Info, Eye, EyeOff, Save, X, ArrowLeft } from 'lucide-react';

const SettingsView = () => {
  const { user, login } = useAuth();
  const { dark } = useTheme();
  const [view, setView] = useState('main');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    birthday: user?.birthday || '',
    location: user?.location || '',
    designation: user?.designation || '',
    department: user?.department || '',
    timezone: user?.timezone || '',
    biography: user?.biography || '',
    socialMedia: user?.socialMedia || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nickname: user.nickname || '',
        birthday: user.birthday || '',
        location: user.location || '',
        designation: user.designation || '',
        department: user.department || '',
        timezone: user.timezone || '',
        biography: user.biography || '',
        socialMedia: user.socialMedia || ''
      });
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return setMessage({ text: "Passwords do not match", type: 'error' });
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/auth/change-password', {
        oldPassword: passwords.old,
        newPassword: passwords.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage({ text: "Password updated successfully!", type: 'success' });
        setPasswords({ old: '', new: '', confirm: '' });
        setTimeout(() => setView('main'), 2000);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error updating password", type: 'error' });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/auth/update-profile/${user.id || user._id}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        login(res.data.user);
        setIsEditing(false);
        setMessage({ text: "Profile updated successfully!", type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ text: "Failed to save profile.", type: 'error' });
    }
  };

  const renderMain = () => (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className={`flex items-center gap-2 text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
          <Settings size={20} className="text-emerald-500" />
          <span>Account Settings</span>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} /> Discard
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setView('password')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Lock size={16} /> Change Password
            </button>
          )}
        </div>
      </div>

      {message.text && view === 'main' && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {message.text}
        </div>
      )}

      {/* Profile Summary Card */}
      <div className={`card mb-6 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 ${dark ? 'bg-gray-700 text-gray-200' : 'bg-emerald-100 text-emerald-700'
              }`}>
              {user.ProfileImage ? (
                <img
                  src={`${user.ProfileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h4 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{user.name}</h4>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Emp ID: #{(user.id || user._id).substring(0, 5).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            {[
              { label: 'Official Birthday', value: user.birthday || '05 Aug' },
              { label: 'Department', value: user.department || 'Engineering' },
              { label: 'Location', value: user.location || 'Gujarat' },
              { label: 'Designation', value: user.designation || 'Jr React JS Developer' }
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg ${dark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <label className={`text-xs block mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</label>
                <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Profile Sections */}
      <div className={`card ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-5 pb-3 border-b dark:border-gray-700">
          <h3 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>My Profile</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
              title="Edit Profile"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-3 block ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-xs mb-1 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Nickname</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={e => setProfileData({ ...profileData, nickname: e.target.value })}
                    className={`input-field ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                ) : (
                  <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{user.nickname || '-'}</span>
                )}
              </div>
              <div>
                <label className={`text-xs mb-1 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Wish me on</label>
                <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{user.birthday || '-'}</span>
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-3 block ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Timezone
            </label>
            <div>
              <label className={`text-xs mb-1 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Timezone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.timezone}
                  onChange={e => setProfileData({ ...profileData, timezone: e.target.value })}
                  className={`input-field ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              ) : (
                <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{user.timezone || '-'}</span>
              )}
            </div>
          </div>

          {/* Biography */}
          <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-3 block ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Biography
            </label>
            {isEditing ? (
              <textarea
                value={profileData.biography}
                onChange={e => setProfileData({ ...profileData, biography: e.target.value })}
                rows={3}
                className={`input-field w-full resize-none ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            ) : (
              <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{user.biography || '-'}</span>
            )}
          </div>

          {/* Social Media */}
          <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-3 block ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Social Media
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.socialMedia}
                onChange={e => setProfileData({ ...profileData, socialMedia: e.target.value })}
                className={`input-field w-full ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            ) : (
              <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{user.socialMedia || '-'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordView = () => (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={() => setView('main')}
        className={`flex items-center gap-1.5 text-sm mb-6 cursor-pointer transition-colors ${dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <ArrowLeft size={16} />
        Account Settings / <span className="text-emerald-500 font-medium">Change Password</span>
      </button>

      <div className={`card max-w-lg mx-auto ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleChangePassword}>
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Old password
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Current Password"
              value={passwords.old}
              onChange={e => setPasswords({ ...passwords, old: e.target.value })}
              required
              className={`input-field ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="New password"
                value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                required
                className={`input-field ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New password again"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                  className={`input-field pr-14 ${dark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded ${dark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
            <Save size={16} /> Save Password
          </button>
        </form>

        <div className={`mt-5 pt-5 border-t space-y-2 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          {[
            'Password should contain minimum of 10 characters.',
            'Password should contain maximum of 50 characters.',
            'Password should contain at least one of the following special characters & , " / \\ ( ), % . > < #.'
          ].map((rule, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Info size={12} /> {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {view === 'main' ? renderMain() : renderPasswordView()}
    </div>
  );
};

export default SettingsView;
