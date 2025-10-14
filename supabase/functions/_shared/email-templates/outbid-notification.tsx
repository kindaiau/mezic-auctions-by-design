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

interface OutbidNotificationProps {
  bidderName: string;
  auctionTitle: string;
  artist: string;
  yourBid: number;
  newHighestBid: number;
}

export const OutbidNotification = ({
  bidderName,
  auctionTitle,
  artist,
  yourBid,
  newHighestBid,
}: OutbidNotificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>MEZ</Text>
        </Section>
        
        <Heading style={h1}>You've Been Outbid</Heading>
        
        <Text style={text}>
          Hello {bidderName},
        </Text>
        
        <Text style={text}>
          Another bidder has placed a higher bid on:
        </Text>
        
        <Section style={auctionCard}>
          <Text style={auctionTitle}>"{auctionTitle}"</Text>
          <Text style={auctionArtist}>by {artist}</Text>
          
          <Hr style={cardHr} />
          
          <Section style={comparisonSection}>
            <Section style={bidColumn}>
              <Text style={bidColumnLabel}>Your Bid</Text>
              <Text style={yourBidAmount}>${yourBid.toLocaleString()}</Text>
            </Section>
            
            <Section style={arrowSection}>
              <Text style={arrow}>→</Text>
            </Section>
            
            <Section style={bidColumn}>
              <Text style={bidColumnLabel}>New Highest Bid</Text>
              <Text style={newBidAmount}>${newHighestBid.toLocaleString()}</Text>
            </Section>
          </Section>
        </Section>
        
        <Text style={text}>
          Don't let this exceptional piece slip away! Place a new bid to get back in the running.
        </Text>
        
        <Section style={ctaSection}>
          <Text style={ctaText}>PLACE A NEW BID NOW</Text>
        </Section>
        
        <Text style={smallText}>
          Visit the auction page to place your new bid and secure this artwork.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          MEZ Auctions<br />
          Fine Art by Mariana Mezic
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

const smallText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const auctionCard = {
  backgroundColor: '#F5F5F5',
  border: '2px solid #D4AF37',
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

const comparisonSection = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: '16px',
};

const bidColumn = {
  textAlign: 'center' as const,
  flex: '1',
};

const bidColumnLabel = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px 0',
};

const yourBidAmount = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#666666',
  margin: '0',
};

const newBidAmount = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#D4AF37',
  margin: '0',
};

const arrowSection = {
  flex: '0 0 40px',
  textAlign: 'center' as const,
};

const arrow = {
  fontSize: '24px',
  color: '#D4AF37',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '16px',
  backgroundColor: '#D4AF37',
  borderRadius: '4px',
};

const ctaText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  letterSpacing: '2px',
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
