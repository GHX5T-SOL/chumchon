// src/components/SlidingBottomNavigation.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  PanGestureHandler,
  State,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '@/navigation/AppNavigator';
import { theme } from '@/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface TabItem {
  name: keyof MainTabsParamList;
  label: string;
  icon: string;
  iconType: 'ionicons' | 'material';
  isPrimary: boolean;
}

const TAB_ITEMS: TabItem[] = [
  { name: 'Home', label: 'Home', icon: 'home', iconType: 'ionicons', isPrimary: true },
  { name: 'Groups', label: 'Groups', icon: 'people', iconType: 'ionicons', isPrimary: true },
  { name: 'Messages', label: 'Messages', icon: 'chatbubbles', iconType: 'ionicons', isPrimary: true },
  { name: 'Trade', label: 'Trade', icon: 'swap-horizontal', iconType: 'ionicons', isPrimary: true },
  { name: 'Profile', label: 'Profile', icon: 'person', iconType: 'ionicons', isPrimary: true },
  { name: 'Channels', label: 'Channels', icon: 'megaphone', iconType: 'ionicons', isPrimary: false },
  { name: 'Memes', label: 'Memes', icon: 'images', iconType: 'ionicons', isPrimary: false },
  { name: 'Escrow', label: 'Escrow', icon: 'shield-check', iconType: 'material', isPrimary: false },
  { name: 'Leaderboard', label: 'Leaderboard', icon: 'trophy', iconType: 'ionicons', isPrimary: false },
  { name: 'Prices', label: 'Prices', icon: 'trending-up', iconType: 'ionicons', isPrimary: false },
];

const SlidingBottomNavigation = (props: BottomTabBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const panRef = useRef(null);

  // Get current tab from props
  const currentTabName = props.state.routes[props.state.index].name as keyof MainTabsParamList;

  // Debug current route
  console.log('=== SLIDING NAVIGATION DEBUG ===');
  console.log('Current tab name:', currentTabName);
  console.log('Available tabs:', TAB_ITEMS.map(tab => tab.name));
  console.log('Navigation state:', props.state);

  const primaryTabs = TAB_ITEMS.filter(tab => tab.isPrimary);
  const secondaryTabs = TAB_ITEMS.filter(tab => !tab.isPrimary);

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleTabPress = (tabName: keyof MainTabsParamList) => {
    console.log('=== TAB PRESS DEBUG ===');
    console.log('Pressed tab:', tabName);
    console.log('Current tab before navigation:', currentTabName);
    console.log('Navigation props:', props);
    
    try {
      console.log('Attempting navigation to:', tabName);
      props.navigation.navigate(tabName);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        tabName,
        currentTabName
      });
    }
  };

  const renderIcon = (item: TabItem, isActive: boolean) => {
    const iconColor = isActive ? theme.colors.accent : theme.colors.textSecondary;
    const iconSize = 24;

    if (item.iconType === 'ionicons') {
      return <Ionicons name={item.icon as any} size={iconSize} color={iconColor} />;
    } else {
      return <Icon name={item.icon as any} size={iconSize} color={iconColor} />;
    }
  };

  const renderTab = (item: TabItem, index: number) => {
    const isActive = currentTabName === item.name;
    
    console.log(`Tab ${item.name}: isActive = ${isActive}, current tab = ${currentTabName}`);
    
    return (
      <TouchableOpacity
        key={item.name}
        style={[
          styles.tabButton,
          isActive && styles.tabButtonActive
        ]}
        onPress={() => handleTabPress(item.name)}
        activeOpacity={0.7}
      >
        {renderIcon(item, isActive)}
        <Text style={[
          styles.tabLabel,
          isActive && styles.tabLabelActive
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const expandedHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 160],
  });

  const secondaryOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const secondaryTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View style={[styles.container, { height: expandedHeight }]}>
      {/* Primary Tabs Row */}
      <View style={styles.primaryTabsContainer}>
        {primaryTabs.map((item, index) => renderTab(item, index))}
      </View>

      {/* Expand/Collapse Button */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.expandIcon,
          {
            transform: [{
              rotate: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              })
            }]
          }
        ]}>
          <Icon name="chevron-up" size={20} color={theme.colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      {/* Secondary Tabs Row */}
      <Animated.View style={[
        styles.secondaryTabsContainer,
        {
          opacity: secondaryOpacity,
          transform: [{ translateY: secondaryTranslateY }],
        }
      ]}>
        {secondaryTabs.map((item, index) => renderTab(item, index))}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  primaryTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  secondaryTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.accent + '20',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  expandButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  expandIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SlidingBottomNavigation; 