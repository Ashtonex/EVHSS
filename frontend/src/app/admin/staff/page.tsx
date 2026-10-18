import { AUTH_COOKIE_NAME, getStaffProfiles, getStaffSchedules } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StaffClient from "./StaffClient";

export const revalidate = 0;

export default async function StaffSchedulingPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let roster: any[] = [];
  let staffProfiles: any[] = [];

  try {
    const [schedules, profiles] = await Promise.all([
      getStaffSchedules(token),
      getStaffProfiles(token),
    ]);

    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

    roster = schedules
      .map((schedule) => {
        const profile = profileById.get(schedule.staff_id);
        return {
          ...schedule,
          staff_profiles: profile
            ? {
                job_title: profile.job_title,
                user_id: profile.user_id,
              }
            : null,
        };
      })
      .sort((a, b) => new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime());

    staffProfiles = profiles;
  } catch {
    // Backend may be temporarily unavailable; render with an empty roster
    // instead of bouncing the admin to /login on a transient error.
    roster = [];
    staffProfiles = [];
  }

  return (
    <div className="space-y-8 pb-12">
      <StaffClient initialRoster={roster} staffProfiles={staffProfiles} />
    </div>
  );
}
