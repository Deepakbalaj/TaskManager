import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, useColorScheme, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import TaskFormModal from '../components/TaskFormModal';

const STORAGE_KEY = 'TASKS';

export default function TaskScreen({ userEmail, onLogout }) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) setTasks(JSON.parse(stored));
  };

  const saveTasks = async (newTasks) => {
    setTasks(newTasks);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const handleSave = (task) => {
    setTasks((prev) => {
      const existing = prev.find((t) => t.id === task.id);
      return existing
        ? prev.map((t) => (t.id === task.id ? task : t))
        : [...prev, task];
    });
    setModalVisible(false);
    setEditingTask(null);
  };

  const filteredTasks =
    selectedTab === 'all' ? tasks : tasks.filter((t) => t.status === selectedTab);

  const toggleComplete = (id) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, status: t.status === 'complete' ? 'open' : 'complete' } : t
    );
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setEditingTask(item);
        setModalVisible(true);
      }}
    >
      <View style={[styles.card, isDark && styles.cardDark]}>
        <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.cardIconWrapper}>
          <Text>{item.status === 'complete' ? '✅' : '⭕'}</Text>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, isDark && styles.textLight]}>{item.title}</Text>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          </View>
          <Text style={[styles.cardDate, isDark && styles.textMuted]}>Due: {item.dueDate}</Text>
          {item.description ? (
            <Text style={[styles.cardDescription, isDark && styles.textMuted]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Button title="Delete" onPress={() => deleteTask(item.id)} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.darkBg]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.header, isDark && styles.textLight]}>Stay Productive ✨</Text>
          <Text style={[styles.subHeader, isDark && styles.textMuted]}>Track & organize your tasks</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['all', 'open', 'complete'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }}
      >
        <Text style={{ fontSize: 28, color: '#fff' }}>+</Text>
      </TouchableOpacity>

      <TaskFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSubmit={handleSave}
        task={editingTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  darkBg: {
    backgroundColor: '#1c1c1e',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  textLight: {
    color: '#fff',
  },
  textMuted: {
    color: '#a1a1aa',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#3a3a3c',
  },
  tabActive: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#d1d1d1',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cardDark: {
    backgroundColor: '#2c2c2e',
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3a3a3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDate: {
    marginTop: 4,
    fontSize: 13,
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
});
