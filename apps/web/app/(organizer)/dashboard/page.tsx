"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiFetch, getUserFacingErrorMessage } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EventAnalytics = {
  id: string;
  slug: string;
  name: string;
  eventDate: string | null;
  mediaCount: number;
  contributorCount: number;
  pendingMediaCount: number;
  approvedMediaCount: number;
  rejectedMediaCount: number;
};

type ActivityPoint = {
  date: string;
  uploads: number;
};

type DashboardAnalytics = {
  summary: {
    eventCount: number;
    mediaCount: number;
    contributorCount: number;
    pendingMediaCount: number;
    approvedMediaCount: number;
    rejectedMediaCount: number;
  };
  events: EventAnalytics[];
  activity: ActivityPoint[];
};

const MODERATION_COLORS = {
  pending: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
};

function formatShortDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatEventName(name: string) {
  if (name.length <= 18) return name;
  return `${name.slice(0, 18)}…`;
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await apiFetch("/dashboard/analytics");
      setAnalytics(response as DashboardAnalytics);
    } catch (err) {
      console.error(err);
      setError(getUserFacingErrorMessage(err, "Failed to load dashboard analytics."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const mediaChartData = useMemo(() => {
    if (!analytics) return [];

    return analytics.events.map((event) => ({
      name: formatEventName(event.name),
      fullName: event.name,
      media: event.mediaCount,
    }));
  }, [analytics]);

  const contributorChartData = useMemo(() => {
    if (!analytics) return [];

    return analytics.events.map((event) => ({
      name: formatEventName(event.name),
      fullName: event.name,
      contributors: event.contributorCount,
    }));
  }, [analytics]);

  const moderationData = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        name: "Pending",
        value: analytics.summary.pendingMediaCount,
        color: MODERATION_COLORS.pending,
      },
      {
        name: "Approved",
        value: analytics.summary.approvedMediaCount,
        color: MODERATION_COLORS.approved,
      },
      {
        name: "Rejected",
        value: analytics.summary.rejectedMediaCount,
        color: MODERATION_COLORS.rejected,
      },
    ].filter((item) => item.value > 0);
  }, [analytics]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Loading analytics…</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button onClick={() => loadAnalytics()}>Try again</Button>
      </div>
    );
  }

  const hasModerationData = moderationData.length > 0;

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadAnalytics(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>

        <Button size="sm" onClick={() => router.push("/events")}>
          Manage events
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total events"
          value={analytics.summary.eventCount}
          description="Events created in your account"
        />

        <StatCard
          title="Uploaded media"
          value={analytics.summary.mediaCount}
          description="Photos and videos from guests"
        />

        <StatCard
          title="Contributors"
          value={analytics.summary.contributorCount}
          description="Unique guest names across events"
        />

        <StatCard
          title="Pending moderation"
          value={analytics.summary.pendingMediaCount}
          description="Uploads waiting for review"
        />
      </div>

      {/* Main charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">
              Media uploaded per event
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Total photos and videos collected by event.
            </p>
          </CardHeader>

          <CardContent>
            {mediaChartData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Create an event to see upload activity.
              </div>
            ) : (
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mediaChartData}
                    margin={{
                      top: 8,
                      right: 8,
                      left: -18,
                      bottom: 45,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={65}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => [value, "Media"]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullName ?? ""
                      }
                    />
                    <Bar
                      dataKey="media"
                      name="Media"
                      fill="#6366f1"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">
              Contributors per event
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Guests who have uploaded at least one item.
            </p>
          </CardHeader>

          <CardContent>
            {contributorChartData.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Upload data will appear here.
              </div>
            ) : (
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributorChartData}
                    margin={{
                      top: 8,
                      right: 8,
                      left: -18,
                      bottom: 45,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={65}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => [value, "Contributors"]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullName ?? ""
                      }
                    />
                    <Bar
                      dataKey="contributors"
                      name="Contributors"
                      fill="#14b8a6"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Moderation and activity */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Moderation status</CardTitle>
            <p className="text-xs text-muted-foreground">
              Current status of all uploaded media.
            </p>
          </CardHeader>

          <CardContent>
            {!hasModerationData ? (
              <div className="flex h-[250px] items-center justify-center text-center text-sm text-muted-foreground">
                No media has been uploaded yet.
              </div>
            ) : (
              <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moderationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {moderationData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Upload activity
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Media uploaded during the last 30 days.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[250px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.activity}
                  margin={{
                    top: 8,
                    right: 8,
                    left: -18,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    minTickGap={24}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    labelFormatter={(label) => formatShortDate(String(label))}
                    formatter={(value) => [value, "Uploads"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    name="Uploads"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event activity list */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Event activity</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              A detailed overview of uploads and contributors.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/events")}
          >
            View all events
          </Button>
        </CardHeader>

        <CardContent>
          {analytics.events.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm font-medium">No events yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create an event to start collecting photos and videos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => router.push(`/events/${event.slug}`)}
                  className="flex w-full flex-col gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {event.name}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString()
                        : "No event date"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:flex sm:items-center sm:gap-6">
                    <div>
                      <div className="font-semibold tabular-nums">
                        {event.mediaCount}
                      </div>
                      <div className="text-muted-foreground">Media</div>
                    </div>

                    <div>
                      <div className="font-semibold tabular-nums">
                        {event.contributorCount}
                      </div>
                      <div className="text-muted-foreground">
                        Contributors
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold tabular-nums text-yellow-600">
                        {event.pendingMediaCount}
                      </div>
                      <div className="text-muted-foreground">Pending</div>
                    </div>

                    <div>
                      <div className="font-semibold tabular-nums text-green-600">
                        {event.approvedMediaCount}
                      </div>
                      <div className="text-muted-foreground">Approved</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}