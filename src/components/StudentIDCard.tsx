import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { MBULogo } from './MBULogo';
import {
  RotateCw,
  QrCode,
  ShieldCheck,
  Award,
  Calendar,
  Mail,
  Phone,
  Building,
  Download,
  CheckCircle2,
  Sparkles,
  User,
  Heart,
  Info,
} from 'lucide-react';

interface StudentIDCardProps {
  profile: UserProfile;
  /** Renders just the badge (no toolbar/hint) for the home page. */
  compact?: boolean;
}

export const StudentIDCard: React.FC<StudentIDCardProps> = ({
  profile,
  compact = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Download ID card as image
  const handleDownloadCard = () => {
    try {
      setIsDownloading(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 650;
      canvas.height = 400;

      // Card Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 650, 400);

      // Top Navy Header Bar
      const headerGrad = ctx.createLinearGradient(0, 0, 650, 0);
      headerGrad.addColorStop(0, '#091b38');
      headerGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, 650, 75);

      // Gold Accent Line
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 75, 650, 4);

      // University Title
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('MOHAN BABU UNIVERSITY', 70, 26);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('STUDENT IDENTITY CARD', 70, 46);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText('School of Computing • Department of Data Science', 70, 62);

      // Photo Frame
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(30, 100, 140, 175);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 100, 140, 175);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('STUDENT PHOTO', 45, 190);

      // Student Details
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('STUDENT NAME', 195, 115);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(profile.name || 'Bhavya Potnuru', 195, 138);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('ROLL NUMBER', 195, 162);

      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(profile.roll_no || '24102A030098', 195, 182);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Branch: ${profile.branch || 'B.Tech - Data Science'}`, 195, 210);
      ctx.fillText(`Year / Sec: ${profile.year || '3rd Year'} • Sec ${profile.section || '2'}`, 195, 230);
      ctx.fillText(`Blood Group: ${profile.blood_group || 'O+'}    Valid: ${profile.valid_thru || '2024-2028'}`, 195, 250);
      ctx.fillText(`Faculty In-Charge: ${profile.assistant_professor || 'Bosubabu Sir'}`, 195, 270);

      // Barcode area
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(30, 300, 590, 75);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 300, 590, 75);

      // Barcode simulation
      ctx.fillStyle = '#0f172a';
      for (let x = 60; x < 570; x += 6) {
        if (x % 12 === 0) {
          ctx.fillRect(x, 310, 3, 40);
        } else if (x % 8 === 0) {
          ctx.fillRect(x, 310, 1.5, 40);
        } else {
          ctx.fillRect(x, 310, 2, 40);
        }
      }

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`*${profile.roll_no || '24102A030098'}*  •  OFFICIAL DIGITAL IDENTITY`, 170, 365);

      // Download trigger
      const link = document.createElement('a');
      link.download = `MBU_ID_Card_${profile.roll_no || 'Student'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {!compact && (
        <div className="flex flex-wrap items-center justify-between w-full max-w-lg px-2 text-xs font-semibold text-slate-600 gap-2">
        <div className="flex items-center gap-1.5 text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>MBU Official Student ID Card</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Flip Button */}
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-colors"
            title="Flip to front or back"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-600" />
            <span>{isFlipped ? 'View Front' : 'View Back'}</span>
          </button>

          {/* Download ID Image Button */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-colors"
            title="Download ID Badge as Image"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download</span>
          </button>
        </div>
        </div>
      )}

      {/* Actual Physical ID Card Representation */}
      <div
        className={`w-full print:max-w-none print:w-auto ${compact ? 'max-w-[460px]' : 'max-w-lg'}`}
        ref={cardRef}
      >
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-300/90 bg-white transition-all duration-300 text-left [perspective:1600px]"
          style={{ minHeight: compact ? '0px' : '460px' }}
        >
          {/* Lanyard punch-hole slot */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-slate-200/90 rounded-full border border-slate-300/80 z-20 shadow-inner flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-400/40 rounded-full"></div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsFlipped((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped((prev) => !prev);
              }
            }}
            aria-label={isFlipped ? 'View front of student ID card' : 'View back of student ID card'}
            title={isFlipped ? 'Click to view front' : 'Click to view back'}
            className={`grid w-full cursor-pointer transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* ================= FRONT OF CARD ================= */}
            <div className="[grid-area:1/1] flex flex-col h-full select-none rounded-3xl overflow-hidden [backface-visibility:hidden]">
              {/* Card Header with MBU Logo and Gold Banner */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 pt-7 pb-3.5 text-center relative border-b-2 border-amber-400">
                <div className="flex items-center justify-between gap-3">
                  <div className="shrink-0 bg-white/10 p-1 rounded-lg backdrop-blur-xs">
                    <MBULogo size="sm" />
                  </div>

                  <div className="flex-1 text-center min-w-0">
                    <div className="text-[10px] sm:text-[11px] tracking-widest uppercase font-extrabold text-amber-300 font-mono">
                      MOHAN BABU UNIVERSITY
                    </div>
                    <div className="text-xs sm:text-base font-black tracking-tight text-white leading-tight">
                      STUDENT IDENTITY CARD
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-300 tracking-wider truncate">
                      School of Computing • Department of Data Science
                    </div>
                  </div>

                  {/* University Hologram Crest */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-950 flex flex-col items-center justify-center text-[7px] font-black text-amber-300">
                      <span>MBU</span>
                      <span className="text-[5px] text-slate-300">VALID</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-white via-slate-50/60 to-blue-50/30">
                <div className="flex items-start gap-4">
                  {/* Student Portrait Photo */}
                  <div className="relative group shrink-0">
                    <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-md bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-2xl relative">
                      {profile.profile_photo ? (
                        <img
                          src={profile.profile_photo}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-900 text-white p-2 text-center">
                          <User className="w-10 h-10 text-slate-300 mb-1" />
                          <span className="text-xl font-black">
                            {profile.name
                              ? profile.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                              : 'BP'}
                          </span>
                          <span className="text-[8px] font-mono tracking-widest text-amber-300 uppercase mt-1">
                            MBU STUDENT
                          </span>
                        </div>
                      )}

                      {/* Official Holographic Seal Stamp */}
                      <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-600 shadow-xs flex items-center justify-center text-[8px] font-black text-amber-950">
                        MBU
                      </div>
                    </div>
                  </div>

                  {/* Student Credentials Column */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Student Full Name
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {profile.name}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        University Roll Number
                      </div>
                      <div className="text-sm sm:text-base font-black font-mono text-blue-900 tracking-wider">
                        {profile.roll_no}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          Branch
                        </span>
                        <span className={`font-bold text-slate-800 block ${compact ? 'text-[11px] leading-tight' : 'text-xs truncate'}`}>
                          {profile.branch}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          Year / Section
                        </span>
                        <span className="font-bold text-slate-800 text-xs block">
                          {profile.year} • Sec {profile.section}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          Blood Group
                        </span>
                        <span className="font-black text-red-700 text-xs block">
                          {profile.blood_group || 'O+'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          Validity Period
                        </span>
                        <span className="font-bold text-slate-700 text-xs block">
                          {profile.valid_thru || '2024–2028'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide & Barcode Section */}
                <div className="pt-2 border-t border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="truncate">
                      Faculty Guide: <strong>{profile.assistant_professor}</strong>
                    </span>
                    <span className="shrink-0 text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300 text-[10px]">
                      Verified Active
                    </span>
                  </div>

                  {/* Authentic High-Density Scannable Barcode */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                    <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 h-9 w-full max-w-[320px] overflow-hidden">
                      {Array.from({ length: 52 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full ${
                            i % 5 === 0
                              ? 'w-1 sm:w-1.5 bg-black'
                              : i % 4 === 0
                              ? 'w-0.5 sm:w-1 bg-black'
                              : i % 3 === 0
                              ? 'w-1 sm:w-1 bg-black'
                              : i % 2 === 0
                              ? 'w-0.5 sm:w-0.5 bg-black'
                              : 'w-0.5 sm:w-1 bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono tracking-widest text-slate-800 mt-1 font-extrabold">
                      *{profile.roll_no}*
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BACK OF CARD ================= */}
            <div className="[grid-area:1/1] rounded-3xl overflow-hidden bg-slate-50 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="p-6 flex flex-col justify-between h-full text-slate-800 text-xs space-y-4">
              <div className="space-y-3.5">
                {/* University Postal Address Header */}
                <div className="text-center pb-2 border-b border-slate-200">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    MOHAN BABU UNIVERSITY
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    Sree Sainath Nagar, A.Rangampet, Chandragiri, Tirupati – 517102, Andhra Pradesh, India
                  </div>
                  <div className="text-[9px] text-blue-700 font-mono font-medium">
                    www.mbu.asia • ds-lab@mbu.asia
                  </div>
                </div>

                {/* Contact & Residential Details */}
                <div className="space-y-2 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">
                      Email: <strong className="text-slate-900">{profile.email || 'potnurubhavya999@gmail.com'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Student Phone: <strong className="text-slate-900">{profile.phone || '+91 98765 43210'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      Emergency Contact: <strong className="text-slate-900">{profile.emergency_contact || '+91 98765 00000'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      Hostel / Campus Zone: <strong className="text-slate-900">{profile.hostel_room || 'Block B, Room 204'}</strong>
                    </span>
                  </div>
                </div>

                {/* Official Regulations & Instructions */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-[10px] text-slate-600 space-y-1">
                  <div className="font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-700" />
                    <span>Cardholder Directives:</span>
                  </div>
                  <p>1. Must be produced during laboratory sessions, practical viva, and library access.</p>
                  <p>2. If lost or discovered, return immediately to the Office of Academic Affairs, MBU.</p>
                  <p>3. This card is non-transferable and remains the official property of Mohan Babu University.</p>
                </div>
              </div>

              {/* Back Footer: Digital Verification QR & Signatures */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs">
                    <QrCode className="w-11 h-11 text-slate-900" />
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono leading-tight">
                    <span className="font-bold text-slate-900">DIGITAL VERIFIED</span>
                    <br />
                    <span>ID: {profile.roll_no}</span>
                    <br />
                    <span className="text-emerald-700 font-semibold">SEC: ACTIVE</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-slate-900 font-bold leading-none">
                    Dr. S. K. Registrar
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold border-t border-slate-400 mt-1 pt-0.5">
                    Registrar & Controller
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      {!compact && (
        <div className="text-xs text-slate-500 text-center">
          <span>Click the card to flip it and view the back.</span>
        </div>
      )}
    </div>
  );
};
