import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface TableHeaderProps {
  months: string[];
  isPortrait: boolean;
  currentHalfMonth: number;
  onHeaderScroll?: (offset: number) => void;
  headerScrollRef?: React.RefObject<ScrollView>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  months,
  isPortrait,
  currentHalfMonth,
  onHeaderScroll,
  headerScrollRef,
}) => {
  const { theme } = useTheme();
  const localRef = useRef<ScrollView>(null);
  const ref = headerScrollRef || localRef;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.stickyHeaderScroll}
      scrollEnabled={false}
      ref={ref}
      onScroll={onHeaderScroll ? (e) => onHeaderScroll(e.nativeEvent.contentOffset.x) : undefined}
      scrollEventThrottle={16}
    >
      <View style={[styles.headerRow, { backgroundColor: theme.background }]}>
        {months.map((month, index) => {
          let isCurrentPeriod = false;

          if (isPortrait) {
            const slotStart = index * 4;
            const slotEnd = slotStart + 3;
            isCurrentPeriod = currentHalfMonth >= slotStart && currentHalfMonth <= slotEnd;
          } else {
            isCurrentPeriod = index === currentHalfMonth;
          }

          return (
            <View
              key={index}
              style={[
                isPortrait ? styles.twoMonthCell : styles.monthCell,
                {
                  borderColor: theme.border,
                  backgroundColor: isCurrentPeriod ? theme.border : theme.surface
                }
              ]}
            >
              <Text style={[styles.monthText, { color: theme.textSecondary }]}>
                {isPortrait ? month : (index % 2 === 0 ? month : '')}
              </Text>
              {!isPortrait && (
                <Text style={[styles.halfMonthText, { color: theme.textSecondary }]}>
                  {index % 2 === 0 ? '1' : '2'}
                </Text>
              )}
            </View>
          );
        })}
        <View style={[styles.notesCell, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Text style={[styles.headerText, { color: theme.text }]}>Notizen</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stickyHeaderScroll: {
    maxHeight: 60,
  },
  headerRow: {
    flexDirection: 'row',
  },
  monthCell: {
    width: 40,
    padding: 4,
    borderWidth: 1,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoMonthCell: {
    width: 60,
    padding: 4,
    borderWidth: 1,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesCell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 10,
    fontWeight: '500',
  },
  halfMonthText: {
    fontSize: 8,
  },
});
