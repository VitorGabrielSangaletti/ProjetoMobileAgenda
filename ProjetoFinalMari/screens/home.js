import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-web';
import { Agenda } from 'react-native-calendars';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={{}}
        renderEmptyData={() => null}
        style={styles.calendar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  calendar: {
    flex: 1,
  },
});