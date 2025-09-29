import { Heading, SimpleGrid, GridItem } from "@chakra-ui/react";
import DashboardAnalyticsCard from "../../components/dashboard-analytics-card";
import { LuActivity, LuBriefcase, LuCalendar1, LuUser } from "react-icons/lu";
import AppWrapper from "../../components/content-wrapper";
// import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

function AdminDashboard() {
  return (
    <>
      <AppWrapper title={"Dashboard"}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} w="full">
          <DashboardAnalyticsCard
            title="Total Users"
            tooltipText="Number of Registered Users"
            value={"10"}
            link={{ text: "view all users", href: "/admin/user/home" }}
            icon={LuUser}
            iconBg="blue.100"
            iconColor="blue.400"
          />
          <DashboardAnalyticsCard
            title="Active Users"
            tooltipText="Number of Active Users"
            value={"9"}
            link={{ text: "view all users", href: "/admin/user/home" }}
            icon={LuActivity}
            iconBg="green.100"
            iconColor="green.400"
          />
          <DashboardAnalyticsCard
            title="Total Roles"
            tooltipText="Number of Registered Roles"
            value={"3"}
            link={{ text: "view all roles", href: "/admin/user/home" }}
            icon={LuBriefcase}
            iconBg="orange.100"
            iconColor="orange.400"
          />
          <DashboardAnalyticsCard
            title="Pending Confirmation"
            tooltipText="Number of Pending Account Confirmations"
            value={"2"}
            link={{ text: "view all roles", href: "/admin/user/home" }}
            icon={LuCalendar1}
            iconBg="red.100"
            iconColor="red.400"
          />
          {/* <GridItem></GridItem> */}
        </SimpleGrid>

        <SimpleGrid mt={4} columns={{ base: 1, lg: 3 }} gap={4} w="full">
          <GridItem bg={"white"} p={4} shadow={"xs"} height={"500px"}>
            <Heading>User By Status</Heading>
            <ResponsivePie
              data={[
                {
                  id: "pending_confirmation",
                  label: "pending confirmation",
                  value: 8,
                },
                {
                  id: "active_user",
                  label: "active user",
                  value: 160,
                },
                {
                  id: "inactive_user",
                  label: "inactive user",
                  value: 3,
                },
              ]}
              margin={{ top: 60, right: 60, bottom: 80, left: 60 }}
              innerRadius={0.6}
              padAngle={0.6}
              cornerRadius={2}
              isInteractive={false}
              activeOuterRadiusOffset={8}
              arcLinkLabel={"label"}
              arcLinkLabelsTextOffset={5}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsOffset={-13}
              arcLinkLabelsDiagonalLength={22}
              arcLinkLabelsStraightLength={10}
              arcLinkLabelsThickness={3}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsRadiusOffset={0.45}
              arcLabelsSkipAngle={2}
              colors={["#60a5fa", "#4ade80", "#fb923c"]}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 1]],
              }}
            />
          </GridItem>
          <GridItem
            bg={"white"}
            p={4}
            shadow={"xs"}
            colSpan={{ base: 1, lg: 2 }}
            height={"500px"}
          >
            <Heading>User By Status</Heading>
            <ResponsiveLine /* or Line for fixed dimensions */
              data={[
                {
                  id: "japan",
                  data: [
                    { x: "09-01", y: 120 },
                    { x: "09-02", y: 119 },
                    { x: "09-03", y: 13 },
                    { x: "09-04", y: 128 },
                    { x: "09-05", y: 90 },
                    { x: "09-06", y: 37 },
                    { x: "09-07", y: 74 },
                    { x: "09-08", y: 296 },
                    { x: "09-09", y: 151 },
                    { x: "09-10", y: 145 },
                    { x: "09-11", y: 119 },
                    { x: "09-12", y: 45 },
                    { x: "09-13", y: 88 },
                    { x: "09-14", y: 132 },
                    { x: "09-15", y: 67 },
                    { x: "09-16", y: 52 },
                    { x: "09-17", y: 5 },
                    { x: "09-18", y: 34 },
                    { x: "09-19", y: 40 },
                    { x: "09-20", y: 12 },
                    { x: "09-21", y: 77 },
                    { x: "09-22", y: 101 },
                    { x: "09-23", y: 28 },
                    { x: "09-24", y: 14 },
                    { x: "09-25", y: 63 },
                    { x: "09-26", y: 59 },
                    { x: "09-27", y: 22 },
                    { x: "09-28", y: 9 },
                    { x: "09-29", y: 84 },
                    { x: "09-30", y: 3 },
                  ],
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
                legend: "transportation",
                legendOffset: 80,
              }}
              axisLeft={{ legend: "count", legendOffset: -40 }}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "seriesColor" }}
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
              enableGridX={true}
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

          {/* <GridItem bg={"white"} p={4} shadow={"xs"} colSpan={{base: 1, lg: 2}} height={"500px"}>
            <Heading>User By Status</Heading>
            <ResponsiveBar
              data={[
                { country: "AD", kebab: 9, kebab2: 95, kebabColor: "hsl(219, 70%, 50%)" },
                { country: "AE", kebab: 5, kebab2: 149, kebabColor: "hsl(185, 70%, 50%)" },
                { country: "AF", kebab: 4, kebab2: 45, kebabColor: "hsl(34, 70%, 50%)" },
                { country: "AG", kebab: 5, kebab2: 56, kebabColor: "hsl(1, 70%, 50%)" },
                { country: "AI", kebab: 4, kebab2: 47, kebabColor: "hsl(196, 70%, 50%)" },
                { country: "AL", kebab: 9, kebab2: 95, kebabColor: "hsl(25, 70%, 50%)" },
                { country: "AM", kebab: 6, kebab2: 143, kebabColor: "hsl(40, 70%, 50%)" },
                { country: "NP", kebab: 10, kebab2: 143, kebabColor: "hsl(300, 70%, 50%)" },
                { country: "IN", kebab: 8, kebab2: 132, kebabColor: "hsl(120, 70%, 50%)" },
                { country: "CH", kebab: 2, kebab2: 77, kebabColor: "hsl(50, 70%, 50%)" },
                { country: "CU", kebab: 9, kebab2: 143, kebabColor: "hsl(340, 70%, 50%)" },
                { country: "CP", kebab: 3, kebab2: 61, kebabColor: "hsl(200, 70%, 50%)" },
                { country: "BG", kebab: 2, kebab2: 143, kebabColor: "hsl(100, 70%, 50%)" },
                { country: "SB", kebab: 5, kebab2: 143, kebabColor: "hsl(260, 70%, 50%)" },
                { country: "DA", kebab: 1, kebab2: 88, kebabColor: "hsl(180, 70%, 50%)" },
                { country: "US", kebab: 7, kebab2: 120, kebabColor: "hsl(15, 70%, 50%)" }
              ]}
              indexBy="country"
              keys={["kebab"]}
              labelSkipHeight={16}
              labelSkipWidth={16}
              labelTextColor="#333333"
              colors={["#46c363", "#c34646ff"]}
              margin={{ bottom: 90, left: 30, right: 10, top: 30}}
              labelPosition="end"
              labelOffset={10}
              groupMode="grouped"
              axisBottom={{
                tickRotation: -90,
                legend: "country",
                legendOffset: 46,
              }}
              onClick={() => {}}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          </GridItem> */}
        </SimpleGrid>
      </AppWrapper>
    </>
  );
}

export default AdminDashboard;
