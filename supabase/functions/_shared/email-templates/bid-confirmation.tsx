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

interface BidConfirmationProps {
  bidderName: string;
  auctionTitle: string;
  artist: string;
  bidAmount: number;
  maxBid: number;
  currentBid: number;
  isLeading: boolean;
  endTime: string;
}

export const BidConfirmation = ({
  bidderName,
  auctionTitle,
  artist,
  bidAmount,
  maxBid,
  currentBid,
  isLeading,
  endTime,
}: BidConfirmationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>MEZ</Text>
        </Section>
        
        <Heading style={h1}>Bid Placed Successfully!</Heading>
        
        <Text style={text}>
          Hello {bidderName},
        </Text>
        
        <Text style={text}>
          Your bid has been placed on:
        </Text>
        
        <Section style={auctionCard}>
          <Text style={auctionTitle}>"{auctionTitle}"</Text>
          <Text style={auctionArtist}>by {artist}</Text>
          
          <Hr style={cardHr} />
          
          <Section style={bidDetails}>
            <Text style={bidLabel}>Your Submitted Bid:</Text>
            <Text style={bidValue}>${bidAmount.toLocaleString()}</Text>
          </Section>
          
          <Section style={bidDetails}>
            <Text style={bidLabel}>Maximum (Proxy) Bid:</Text>
            <Text style={bidValue}>${maxBid.toLocaleString()}</Text>
          </Section>
          
          <Section style={bidDetails}>
            <Text style={bidLabel}>Current Standing:</Text>
            <Text style={bidValue}>${currentBid.toLocaleString()}</Text>
          </Section>
          
          <Hr style={cardHr} />
          
          <Section style={statusSection}>
            <Text style={isLeading ? statusLeading : statusOutbid}>
              {isLeading ? '✓ YOU ARE CURRENTLY LEADING' : 'CURRENTLY OUTBID'}
            </Text>
          </Section>
        </Section>
        
        <Text style={text}>
          {isLeading 
            ? 'Congratulations! You currently have the highest bid. We\'ll notify you immediately if you\'re outbid.'
            : 'Another bidder has placed a higher maximum bid. You can place a new bid to get back in the lead.'}
        </Text>
        
        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>About Proxy Bidding:</strong> Your maximum bid is kept confidential. 
            The system automatically bids on your behalf up to your maximum amount, 
            incrementing only as needed to maintain your lead.
          </Text>
        </Section>
        
        <Text style={text}>
          <strong>Auction ends:</strong> {endTime}
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

const statusSection = {
  textAlign: 'center' as const,
  marginTop: '8px',
};

const statusLeading = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#D4AF37',
  letterSpacing: '1px',
  margin: '0',
};

const statusOutbid = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#666666',
  letterSpacing: '1px',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#FFFBF0',
  border: '1px solid #D4AF37',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '22px',
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
