import { Heading, SimpleGrid, GridItem } from "@chakra-ui/react";
import DashboardAnalyticsCard from "../../components/dashboard-analytics-card";
import { LuActivity, LuBriefcase, LuCalendar1, LuUser } from "react-icons/lu";
import AppWrapper from "../../components/content-wrapper";
// import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { useLoaderData } from "react-router";

function AdminDashboard() {
  const summaryData: {
    totalUsers: number;
    activeUsers: number;
    inActiveUsers: number;
    pendingEmailConfirmations: number;
    totalRoles: number;
    userRegisterDatas: { registeredDate: string; userRegistered: number }[];
  } = useLoaderData();

  const pieChartData = [
    {
      id: "pending_confirmation",
      label: "pending Confirmation",
      value: summaryData.pendingEmailConfirmations,
    },
    {
      id: "active_user",
      label: "active user",
      value: summaryData.activeUsers,
    },
    {
      id: "inactive_user",
      label: "inactive user",
      value: summaryData.inActiveUsers,
    },
  ];

  return (
    <>
      <AppWrapper title={"Dashboard"}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} w="full">
          <DashboardAnalyticsCard
            title="Total Users"
            tooltipText="Number of Registered Users"
            value={`${summaryData.totalUsers}`}
            link={{ text: "view users", href: "/admin/user/home" }}
            icon={LuUser}
            iconBg="blue.100"
            iconColor="blue.400"
          />
          <DashboardAnalyticsCard
            title="Active Users"
            tooltipText="Number of Active Users"
            value={`${summaryData.activeUsers}`}
            link={{ text: "view users", href: "/admin/user/home" }}
            icon={LuActivity}
            iconBg="green.100"
            iconColor="green.400"
          />
          <DashboardAnalyticsCard
            title="Total Roles"
            tooltipText="Number of Registered Roles"
            value={`${summaryData.totalRoles}`}
            link={{ text: "view roles", href: "/admin/user/home" }}
            icon={LuBriefcase}
            iconBg="orange.100"
            iconColor="orange.400"
          />
          <DashboardAnalyticsCard
            title="Pending Confirmation"
            tooltipText="Number of Pending Account Confirmations"
            value={`${summaryData.pendingEmailConfirmations}`}
            link={{ text: "view users", href: "/admin/user/home" }}
            icon={LuCalendar1}
            iconBg="red.100"
            iconColor="red.400"
          />
          {/* <GridItem></GridItem> */}
        </SimpleGrid>

        <SimpleGrid mt={4} columns={{ base: 1, lg: 3 }} gap={4} w="full">
          <GridItem bg={"white"} p={4} shadow={"xs"} height={"500px"}>
            <Heading>Users By Status</Heading>
            <ResponsivePie
              data={pieChartData}
              margin={{ top: 65, right: 30, bottom: 65, left: 46 }}
              innerRadius={0.6}
              padAngle={0.6}
            //   cornerRadius={2}
              activeOuterRadiusOffset={8}
              enableArcLinkLabels={false}
              arcLinkLabelsTextOffset={0}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLabelsRadiusOffset={0.5}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsTextColor="#fafafa"
              colors={["#60a5fa", "#4ade80", "#fb923c"]}
              isInteractive={false}
              legends={[
                {
                  anchor: "left",
                  direction: "column",
                  translateX: -45,
                  translateY: -160,
                  itemWidth: 100,
                  itemHeight: 31,
                },
              ]}
            />
          </GridItem>
          <GridItem
            bg={"white"}
            p={4}
            shadow={"xs"}
            colSpan={{ base: 1, lg: 2 }}
            height={"500px"}
          >
            <Heading>Users Registered By Date</Heading>
            <ResponsiveLine /* or Line for fixed dimensions */
              data={[
                {
                  id: "userRegister",
                  data: summaryData.userRegisterDatas.map((c) => {
                    return { x: c.registeredDate, y: c.userRegistered };
                  }),
                },
              ]}
              margin={{ top: 30, right: 10, bottom: 120, left: 50 }}
              colors={["#46c363", "#c34646ff"]}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
              }}
              axisBottom={{
                tickRotation: -90,
                legend: "Date",
                legendOffset: 60,
              }}
              axisLeft={{
                legend: "Number of Users Registered",
                legendOffset: -40,
              }}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "seriesColor" }}
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={false}
              enableGridX={true}
              enablePointLabel={true}
              //   legends={[
              //     {
              //       anchor: "bottom-right",
              //       direction: "column",
              //       translateX: 100,
              //       itemWidth: 80,
              //       itemHeight: 22,
              //       symbolShape: "circle",
              //     },
              //   ]}
            />
          </GridItem>
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}

export default AdminDashboard;
