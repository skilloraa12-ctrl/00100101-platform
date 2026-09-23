import { useEffect, useState } from "react";
import { supabase, APP_ID } from "./lib/supabaseClient.js";

// Passwordless, invite-only login for COURSE content specifically — the rest
// of the app (home, library, reference, glossary...) stays open to anyone.
// There is no sign-up: shouldCreateUser is false, so typing a random email
// here never creates a new account. Only an email the admin already added in
// Supabase (Authentication -> Users -> Add user) AND granted access to via
// course_access (see supabase/course_access.sql) can actually get in.

function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Checked BEFORE requesting the magic link: without this, anyone who
    // exists in auth.users (e.g. invited on a different platform sharing
    // this Supabase project) would still receive a sign-in email for THIS
    // app, even with zero course_access grant here.
    const { data: allowed, error: rpcError } = await supabase.rpc("has_course_access", {
      check_email: email,
      check_app_id: APP_ID,
    });
    if (rpcError || !allowed) {
      setBusy(false);
      setError("Доступу немає. Зверніться до адміністратора.");
      return;
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href, shouldCreateUser: false },
    });
    setBusy(false);
    if (otpError) setError("Доступу немає. Зверніться до адміністратора.");
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-stone-100 mb-3">Перевір пошту</h1>
        <p className="text-sm text-stone-400">
          Надіслали посилання для входу на <span className="text-stone-200">{email}</span>. Відкрий його з цього ж пристрою й браузера.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-stone-100 mb-3">Увійти</h1>
      <p className="text-sm text-stone-400 mb-5">Вхід без пароля: введи пошту, ми надішлемо посилання для входу.</p>
      <form onSubmit={submit} className="bg-stone-900 border border-stone-800 rounded-lg p-5">
        <input
          type="email"
          required
          autoFocus
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-stone-950 border border-stone-700 rounded-md text-stone-100 text-sm focus:outline-none focus:border-amber-500"
        />
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2.5 bg-amber-500 hover:opacity-90 text-stone-950 font-medium rounded-md text-sm disabled:opacity-60"
        >
          {busy ? "Надсилаємо…" : "Надіслати посилання"}
        </button>
      </form>
    </div>
  );
}

function NoAccessNotice({ email }) {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-stone-100 mb-3">Доступу немає</h1>
      <p className="text-sm text-stone-400 mb-1">{email}</p>
      <p className="text-sm text-stone-500 mb-5">Зверніться до адміністратора.</p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="px-4 py-2 border border-stone-700 hover:bg-stone-800 text-stone-300 rounded-md text-sm"
      >
        Вийти
      </button>
    </div>
  );
}

// Wraps just the COURSE-STUDY content (a lesson) with an access check. When
// Supabase isn't configured (no env vars) it renders children unchanged, so
// local dev on course content never needs a Supabase project.
export default function CourseAccessGate({ children }) {
  const [status, setStatus] = useState(supabase ? "loading" : "ok");
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const evaluate = async (session) => {
      if (!session) {
        if (active) { setEmail(null); setStatus("signedOut"); }
        return;
      }
      const userEmail = session.user.email;
      const { data, error } = await supabase
        .from("course_access")
        .select("app_id")
        .eq("email", userEmail)
        .eq("app_id", APP_ID)
        .maybeSingle();
      if (!active) return;
      setEmail(userEmail);
      setStatus(error || !data ? "noAccess" : "ok");
    };

    supabase.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => evaluate(session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") return null;
  if (status === "signedOut") return <MagicLinkForm />;
  if (status === "noAccess") return <NoAccessNotice email={email} />;
  return children;
}
