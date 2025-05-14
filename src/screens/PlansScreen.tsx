


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.8;
const SPACER = (width - CARD_WIDTH) / 2;

const plans = [
  {
    id: 'basic',
    name: 'Free',
    tier: 'Basic',
    price: 'Free',
    description: 'Essential streaming experience',
    features: [
      'Access to curated free movie collection',
      'Limited movie library access',
      'New content updates monthly',
      'Basic movie information and details',
      'Ad-supported browsing experience',
    ],
    buttonText: 'Default Plan',
    color: '#1A1D29',
    topTag: 'CURRENT',
    topTagColor: '#FF4455',
    buttonColor: '#333',
    textColor: '#888',
    selectable: false,
  },
  {
    id: 'gold',
    name: 'Gold',
    tier: 'Gold',
    price: 'Rs.199',
    description: 'Perfect for avid viewers',
    features: [
      'Full access to all Free & Gold movies',
      'Exclusive Gold-tier movie collection',
      'Ad-free browsing experience',
      'Enhanced movie details and information',
      'Priority access to newly added content',
    ],
    buttonText: 'Choose Gold',
    color: '#F8C100',
    topTag: '',
    topTagColor: '',
    buttonColor: '#F8C100',
    textColor: '#000',
    selectable: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tier: 'Platinum',
    price: 'Rs.499',
    description: 'The ultimate cinematic experience',
    features: [
      'Complete access to entire movie catalog',
      'Premium exclusive releases and collections',
      'Advanced movie information and metadata',
      'Early access to all new releases',
      'Exclusive platinum-only special collections',
    ],
    buttonText: 'Choose Platinum',
    color: '#C0C0C0',
    topTag: '',
    topTagColor: '',
    buttonColor: '#C0C0C0',
    textColor: '#000',
    selectable: true,
  },
];

const PlansScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');

  return (
    <View style={styles.screen}>
      {/* Header */}
      <TouchableOpacity style={styles.upgradePill} activeOpacity={0.8}>
        <Text style={styles.upgradeText}>Upgrade Your Experience</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Choose the Perfect Plan for You</Text>
      <Text style={styles.subtitle}>
        Get access to premium content with our flexible subscription options.
        Cancel anytime.
      </Text>

      {/* Horizontal swipeable plans */}
      <FlatList
        data={[{ key: 'left-spacer' }, ...plans, { key: 'right-spacer' }]}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        keyExtractor={(item) => item.id || item.key}
        renderItem={({ item }) => {
          if ((item as any).key?.includes('spacer')) {
            return <View style={{ width: SPACER }} />;
          }
          const plan = item as typeof plans[0];
          const isSelected = selectedPlan === plan.id;
          return (
            <View style={[styles.card, { width: CARD_WIDTH, backgroundColor: plan.color }]}>
              {plan.topTag ? (
                <View style={[styles.topTag, { backgroundColor: plan.topTagColor }]}>
                  <Text style={styles.topTagText}>{plan.topTag}</Text>
                </View>
              ) : null}
              <Text style={styles.planTier}>{plan.tier}</Text>
              <Text style={styles.planPrice}>{plan.price}/month</Text>
              <Text style={styles.planDesc}>{plan.description}</Text>

              <View style={styles.features}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={plan.textColor} />
                    <Text style={[styles.featureText, { color: plan.textColor }]}>{f}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                disabled={!plan.selectable}
                onPress={() => plan.selectable && setSelectedPlan(plan.id)}
                style={[
                  styles.button,
                  {
                    backgroundColor: isSelected ? plan.buttonColor : 'transparent',
                    borderColor: plan.buttonColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonLabel,
                    {
                      color: isSelected ? '#fff' : plan.buttonColor,
                    },
                  ]}
                >
                  {isSelected ? 'Selected' : plan.buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 16,
  },
  upgradePill: {
    alignSelf: 'center',
    backgroundColor: '#FF4455',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  upgradeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  subtitle: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 24,
  },
  card: {
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 20,
  },
  topTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  topTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  planTier: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPrice: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 4,
  },
  planDesc: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 16,
  },
  features: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlansScreen;
