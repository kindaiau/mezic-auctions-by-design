import React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";

interface AdminBidNotificationProps {
  auctionTitle: string;
  artistName: string;
  bidderName: string;
  bidderEmail: string;
  bidderPhone?: string;
  bidAmount: number;
  maximumBid: number;
  status: string;
  timestamp: string;
}

export const AdminBidNotification = ({
  auctionTitle,
  artistName,
  bidderName,
  bidderEmail,
  bidderPhone,
  bidAmount,
  maximumBid,
  status,
  timestamp,
}: AdminBidNotificationProps) => {
  const statusColor = status === "leading" ? "#22c55e" : "#f59e0b";
  const statusText = status === "leading" ? "LEADING" : "OUTBID";

  return (
    <Html>
      <Head />
      <Preview>🎨 New Bid: {bidderName} - {auctionTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎨 New Bid Alert</Heading>
          
          <Section style={section}>
            <Text style={sectionTitle}>Auction Details</Text>
            <Text style={detail}>
              <strong>Title:</strong> {auctionTitle}
            </Text>
            <Text style={detail}>
              <strong>Artist:</strong> {artistName}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={sectionTitle}>Bidder Information</Text>
            <Text style={detail}>
              <strong>Name:</strong> {bidderName}
            </Text>
            <Text style={detail}>
              <strong>Email:</strong> {bidderEmail}
            </Text>
            {bidderPhone && (
              <Text style={detail}>
                <strong>Phone:</strong> {bidderPhone}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={sectionTitle}>Bid Details</Text>
            <Text style={detail}>
              <strong>Bid Amount:</strong> ${bidAmount.toFixed(2)}
            </Text>
            <Text style={detail}>
              <strong>Maximum Proxy Bid:</strong> ${maximumBid.toFixed(2)}
            </Text>
            <Text style={{ ...detail, ...statusBadge, backgroundColor: statusColor }}>
              <strong>Status:</strong> {statusText}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={timestamp}>
            Bid placed at: {timestamp}
          </Text>

          <Text style={footer}>
            MEZ Auctions - Admin Notification
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminBidNotification;

const main = {
  backgroundColor: "#0A0A0A",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  backgroundColor: "#1A1A1A",
  borderRadius: "8px",
};

const h1 = {
  color: "#FFFFFF",
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "30px",
  textAlign: "center" as const,
};

const section = {
  marginBottom: "20px",
};

const sectionTitle = {
  color: "#A0A0A0",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  marginBottom: "10px",
  fontWeight: "600",
};

const detail = {
  color: "#E0E0E0",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#333333",
  margin: "20px 0",
};

const statusBadge = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: "4px",
  color: "#FFFFFF",
  fontWeight: "bold",
};

const timestamp = {
  color: "#808080",
  fontSize: "14px",
  textAlign: "center" as const,
  marginTop: "30px",
};

const footer = {
  color: "#666666",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid #333333",
};
