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
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [codeEmail, setCodeEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);

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

  // Fallback for when tapping the link itself doesn't work (e.g. on iOS,
  // Mail/Safari sometimes "opens" the link in the background to generate a
  // link preview before the person actually taps it - that background
  // request consumes the one-time link, so the real tap lands on an
  // already-used link and bounces back to the login form). The same email
  // also carries a 6-digit code that isn't affected by link prefetching, so
  // typing it in here works even when the link itself doesn't.
  //
  // This form is intentionally NOT gated behind "just sent a link in this
  // page load" (sent === true) - if the link bounced the person back to
  // this page, or they reopened the site later, that in-memory state is
  // already gone even though the code from the email is still valid, so
  // there'd otherwise be nowhere left to type it in.
  const submitCode = async (e) => {
    e.preventDefault();
    setCodeError("");
    setCodeBusy(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: codeEmail, token: code.trim(), type: "email" });
    setCodeBusy(false);
    if (verifyError) setCodeError("Код невірний або протермінований. Спробуй ще раз або надішли новий лист.");
  };

  const openCodeForm = () => {
    if (!codeEmail) setCodeEmail(email);
    setShowCodeForm(true);
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-stone-100 mb-3">Увійти</h1>
      {sent ? (
        <p className="text-sm text-stone-400 mb-5">
          Надіслали лист на <span className="text-stone-200">{email}</span>. Відкрий посилання з цього ж пристрою й браузера.
        </p>
      ) : (
        <p className="text-sm text-stone-400 mb-5">Вхід без пароля: введи пошту, ми надішлемо посилання для входу.</p>
      )}

      {!sent && (
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
      )}

      {!showCodeForm ? (
        <button onClick={openCodeForm} className="mt-4 text-sm text-stone-400 hover:text-amber-400 underline underline-offset-2">
          Вже отримав(-ла) код з листа? Ввести його
        </button>
      ) : (
        <div className="mt-4 bg-stone-900 border border-stone-800 rounded-lg p-5">
          <p className="text-sm text-stone-400 mb-3">
            Посилання не спрацювало (буває в Safari/Пошті на iPhone)? Введи пошту й 6-значний код з листа:
          </p>
          <form onSubmit={submitCode} className="space-y-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={codeEmail}
              onChange={(e) => setCodeEmail(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-md text-stone-100 text-sm focus:outline-none focus:border-amber-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 bg-stone-950 border border-stone-700 rounded-md text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={codeBusy || !code.trim() || !codeEmail.trim()}
                className="px-4 py-2 bg-amber-500 hover:opacity-90 text-stone-950 font-medium rounded-md text-sm disabled:opacity-60 shrink-0"
              >
                {codeBusy ? "…" : "Увійти"}
              </button>
            </div>
          </form>
          {codeError && <p className="text-sm text-red-400 mt-3">{codeError}</p>}
        </div>
      )}
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

// Small account strip for the "Мій прогрес" page: shows the signed-in
// person's name/email with a way to set the name and sign out. Reuses the
// same `profiles` table Designlab already has on this shared Supabase
// project (keyed by user_id) — a person's display name is just a courtesy,
// not an access boundary, so sharing it across the two platforms is fine.
// Renders nothing when Supabase isn't configured or nobody is signed in
// (which is expected now, since signing in only happens via a course).
export function ProfileBar() {
  const [state, setState] = useState({ status: supabase ? "loading" : "none", email: null, name: "" });
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const evaluate = async (session) => {
      if (!session) {
        if (active) setState({ status: "signedOut", email: null, name: "" });
        return;
      }
      const { data } = await supabase.from("profiles").select("full_name").eq("user_id", session.user.id).maybeSingle();
      if (!active) return;
      setState({ status: "signedIn", email: session.user.email, name: data?.full_name || "" });
    };

    supabase.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => evaluate(session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!supabase || state.status !== "signedIn") return null;

  const startEdit = () => {
    setNameInput(state.name);
    setEditing(true);
  };

  const saveName = async () => {
    setSaving(true);
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({ user_id: userId, full_name: nameInput.trim() });
      setState((s) => ({ ...s, name: nameInput.trim() }));
    }
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-stone-900 border border-stone-800 rounded-md px-4 py-3 mb-6">
      <div className="min-w-0">
        <div className="text-sm text-stone-200 truncate">{state.name || "Без імені"}</div>
        <div className="text-xs text-stone-500 truncate">{state.email}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Ваше ім'я"
              autoFocus
              className="px-2 py-1.5 bg-stone-950 border border-stone-700 rounded-md text-stone-100 text-sm w-36 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={saveName}
              disabled={saving}
              className="px-3 py-1.5 bg-amber-500 hover:opacity-90 text-stone-950 rounded-md text-xs font-medium disabled:opacity-60"
            >
              {saving ? "…" : "Зберегти"}
            </button>
          </>
        ) : (
          <button onClick={startEdit} className="px-3 py-1.5 border border-stone-700 hover:bg-stone-800 text-stone-300 rounded-md text-xs">
            {state.name ? "Змінити ім'я" : "Додати ім'я"}
          </button>
        )}
        <button onClick={() => supabase.auth.signOut()} className="px-3 py-1.5 border border-stone-700 hover:bg-stone-800 text-stone-300 rounded-md text-xs">
          Вийти
        </button>
      </div>
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
