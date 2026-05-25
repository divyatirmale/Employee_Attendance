import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import { User, MapPin, Briefcase, GraduationCap, Loader2 } from 'lucide-react';

const MyInfoView = ({ employeeId }) => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const idToFetch = employeeId || user.id;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfo();
  }, [idToFetch]);

  const fetchInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/employee-info/${idToFetch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setInfo(res.data.info);
      }
    } catch (error) {
      console.error("Error fetching info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 dark:text-slate-500">
        <Loader2 size={28} className="animate-spin mr-3" />
        <span className="text-lg">Loading employee information...</span>
      </div>
    );
  }

  const personal = info?.personal || {};
  const address = info?.address || {};
  const education = info?.education || {};
  const employment = info?.employment || {};

  const infoCardClass = "card hover:shadow-md transition-shadow";
  const sectionHeaderClass = "flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700";
  const labelClass = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-sm font-medium text-slate-800 dark:text-slate-200";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Information</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your personal, address, and education details.</p>
        </div>
      </div>

      {/* Jump Navigation */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs font-medium">
        <span className="text-slate-400 dark:text-slate-500 mr-2">JUMP TO:</span>
        {['Profile', 'Personal', 'Address', 'Education'].map(section => (
          <a
            key={section}
            href={`#${section.toLowerCase()}`}
            className="px-3 py-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
          >
            {section}
          </a>
        ))}
      </div>

      {/* Profile Card */}
      <div id="profile" className={infoCardClass}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className={labelClass}>Name</span>
              <p className={valueClass}>{info?.employeeId?.name || user.name}</p>
            </div>
            <div>
              <span className={labelClass}>Employee ID</span>
              <p className={valueClass}>{idToFetch.substring(idToFetch.length - 5).toUpperCase()}</p>
            </div>
            <div>
              <span className={labelClass}>Company Email</span>
              <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{info?.employeeId?.email || user.email}</p>
            </div>
            <div>
              <span className={labelClass}>Location</span>
              <p className={valueClass}>{employment.location || 'Gujarat'}</p>
            </div>
            <div>
              <span className={labelClass}>Primary Contact No</span>
              <p className={valueClass}>-</p>
            </div>
            <div>
              <span className={labelClass}>Extension</span>
              <p className={valueClass}>-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Section */}
      <div id="personal" className={infoCardClass}>
        <div className={sectionHeaderClass}>
          <User size={18} className="text-sky-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Personal</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Blood Group', value: personal.bloodGroup || '-' },
            { label: 'Date of Birth', value: personal.dob ? new Date(personal.dob).toLocaleDateString() : '-' },
            { label: 'Nationality', value: personal.nationality || 'Indian' },
            { label: 'Marital Status', value: personal.maritalStatus || 'Single' },
            { label: 'Marriage Date', value: personal.marriageDate ? new Date(personal.marriageDate).toLocaleDateString() : '-' },
            { label: 'Religion', value: personal.religion || '-' },
            { label: 'Physically Challenged', value: personal.physicallyChallenged || 'No' },
            { label: 'Hobby', value: personal.hobby || '-' },
          ].map((item, idx) => (
            <div key={idx}>
              <span className={labelClass}>{item.label}</span>
              <p className={valueClass}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address Section */}
      <div id="address" className={infoCardClass}>
        <div className={sectionHeaderClass}>
          <MapPin size={18} className="text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Address</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={labelClass}>Current Address</span>
            <p className={valueClass}>{address.current || '-'}</p>
          </div>
          <div>
            <span className={labelClass}>Permanent Address</span>
            <p className={valueClass}>{address.permanent || '-'}</p>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div id="education" className={infoCardClass}>
        <div className={sectionHeaderClass}>
          <GraduationCap size={18} className="text-purple-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Education</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Degree', value: education.degree || '-' },
            { label: 'Institute', value: education.institute || '-' },
            { label: 'Year of Passing', value: education.yearOfPassing || '-' },
            { label: 'Grade/CGPA', value: education.grade || '-' },
          ].map((item, idx) => (
            <div key={idx}>
              <span className={labelClass}>{item.label}</span>
              <p className={valueClass}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyInfoView;
