// English for IT — full course, assembled from per-domain modules.
// Each domain lives in its own file so no single file grows unmanageably
// large; this index just concatenates them in teaching order.
import { BASE_LESSONS } from "./base.js";
import { PYTHON_LESSONS } from "./python.js";
import { SQL_LESSONS } from "./sql.js";
import { BACKEND_LESSONS } from "./backend.js";
import { FRONTEND_LESSONS } from "./frontend.js";
import { FULLSTACK_LESSONS } from "./fullstack.js";
import { HTML_ENGLISH_LESSONS } from "./html.js";
import { CSS_ENGLISH_LESSONS } from "./css.js";
import { JAVASCRIPT_ENGLISH_LESSONS } from "./javascript.js";

export const ENGLISH_LESSONS = [
  ...BASE_LESSONS,
  ...PYTHON_LESSONS,
  ...SQL_LESSONS,
  ...BACKEND_LESSONS,
  ...FRONTEND_LESSONS,
  ...FULLSTACK_LESSONS,
  ...HTML_ENGLISH_LESSONS,
  ...CSS_ENGLISH_LESSONS,
  ...JAVASCRIPT_ENGLISH_LESSONS,
];
