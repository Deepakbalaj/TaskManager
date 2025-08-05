import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

export default function TaskFormModal({ visible, onClose, onSubmit, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('low');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate));
      setPriority(task.priority || 'low');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setPriority('low');
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSubmit({
      id: task?.id || uuid.v4(),
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      status: task?.status || 'open',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.header, isDark && styles.textLight]}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[styles.input, isDark && styles.inputDark]}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[styles.input, styles.textArea, isDark && styles.inputDark]}
          multiline
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateText, isDark && styles.textLight]}>
            📅 Due Date: {dueDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        <View style={styles.priorityRow}>
          {['low', 'medium', 'high'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.priorityButton, priority === level && styles.prioritySelected]}
              onPress={() => setPriority(level)}
            >
              <Text style={priority === level ? styles.prioritySelectedText : styles.priorityText}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{task ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  prioritySelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  priorityText: {
    color: '#333',
  },
  prioritySelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#d7eaffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelBtn: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  textLight: {
    color: '#fff',
  },
});
