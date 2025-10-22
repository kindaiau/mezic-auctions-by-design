import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WinnerNotificationProps {
  bidderName: string;
  auctionTitle: string;
  artist: string;
  winningBid: number;
  endTime: string;
}

export const WinnerNotification = ({
  bidderName,
  auctionTitle,
  artist,
  winningBid,
  endTime,
}: WinnerNotificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>MEZ</Text>
        </Section>
        
        <Heading style={h1}>🎉 Congratulations! You Won! 🎉</Heading>
        
        <Text style={text}>
          Hello {bidderName},
        </Text>
        
        <Text style={congratsText}>
          We're thrilled to inform you that you are the winning bidder!
        </Text>
        
        <Section style={winnerCard}>
          <Text style={auctionTitle}>"{auctionTitle}"</Text>
          <Text style={auctionArtist}>by {artist}</Text>
          
          <Hr style={cardHr} />
          
          <Section style={bidDetails}>
            <Text style={bidLabel}>Your Winning Bid:</Text>
            <Text style={winningBidValue}>${winningBid.toLocaleString()}</Text>
          </Section>
          
          <Section style={bidDetails}>
            <Text style={bidLabel}>Auction Ended:</Text>
            <Text style={bidValue}>{endTime}</Text>
          </Section>
          
          <Hr style={cardHr} />
          
          <Section style={statusSection}>
            <Text style={statusWinner}>
              ✓ WINNING BID
            </Text>
          </Section>
        </Section>
        
        <Text style={text}>
          <strong>Next Steps:</strong>
        </Text>
        
        <Section style={nextStepsBox}>
          <Text style={nextStepsText}>
            1. <strong>Payment:</strong> We'll contact you shortly with payment details and instructions.<br /><br />
            2. <strong>Collection:</strong> Once payment is confirmed, we'll arrange artwork collection or delivery.<br /><br />
            3. <strong>Questions:</strong> Feel free to reach out if you have any questions about your purchase.
          </Text>
        </Section>
        
        <Text style={text}>
          Thank you for participating in MEZ Auctions. We look forward to getting this beautiful piece to you!
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          MEZ Auctions<br />
          Fine Art by Mariana Mezic<br />
          <a href="mailto:mariana@getgas.net.au" style={link}>mariana@getgas.net.au</a>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#FFFFFF',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logoText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#D4AF37',
  letterSpacing: '4px',
  margin: '0',
};

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const congratsText = {
  color: '#D4AF37',
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '28px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const winnerCard = {
  backgroundColor: '#FFFBF0',
  border: '3px solid #D4AF37',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const auctionTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const auctionArtist = {
  fontSize: '16px',
  color: '#666666',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const cardHr = {
  borderColor: '#D4AF37',
  margin: '16px 0',
  opacity: 0.3,
};

const bidDetails = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '12px 0',
};

const bidLabel = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const bidValue = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const winningBidValue = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#D4AF37',
  margin: '0',
};

const statusSection = {
  textAlign: 'center' as const,
  marginTop: '8px',
};

const statusWinner = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#D4AF37',
  letterSpacing: '1px',
  margin: '0',
};

const nextStepsBox = {
  backgroundColor: '#F5F5F5',
  border: '1px solid #E5E5E5',
  borderRadius: '4px',
  padding: '20px',
  margin: '16px 0',
};

const nextStepsText = {
  fontSize: '14px',
  color: '#333333',
  lineHeight: '24px',
  margin: '0',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '32px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '32px',
  lineHeight: '22px',
};

const link = {
  color: '#D4AF37',
  textDecoration: 'none',
};
