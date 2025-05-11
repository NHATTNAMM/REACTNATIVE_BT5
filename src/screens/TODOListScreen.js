import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Button, List, Menu } from 'react-native-paper';
import { db, auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

function TODOListScreen({ navigation }) {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // State cho sửa
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const todosRef = collection(db, 'todos');

  useEffect(() => {
    const q = query(todosRef, orderBy('title'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((docSnap) => {
        const { title, complete } = docSnap.data();
        list.push({
          id: docSnap.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;
    await addDoc(todosRef, {
      title: todo,
      complete: false,
    });
    setTodo('');
  };

  const toggleComplete = async (id, complete) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { complete: !complete });
  };

  const deleteTodo = (id) => {
    // Chỉ xóa trên giao diện bằng cách lọc bỏ todo có id tương ứng
    setTodos(todos.filter((item) => item.id !== id));
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingText(title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;
    const todoDoc = doc(db, 'todos', editingId);
    await updateDoc(todoDoc, { title: editingText });
    setEditingId(null);
    setEditingText('');
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await signOut(auth);
    navigation.replace('Login');
  };

  const handleChangePassword = () => {
    setMenuVisible(false);
    navigation.navigate('ChangePassword');
  };

  const renderItem = ({ item }) => {
    const isEditing = item.id === editingId;

    if (isEditing) {
      return (
        <View style={styles.todoItem}>
          <TextInput
            mode="outlined"
            value={editingText}
            onChangeText={setEditingText}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button mode="contained" onPress={saveEdit}>Cập nhật</Button>
          <Button mode="text" onPress={cancelEditing}>Huỷ</Button>
        </View>
      );
    }

    return (
      <List.Item
        title={item.title}
        onPress={() => toggleComplete(item.id, item.complete)}
        onLongPress={() => startEditing(item.id, item.title)}
        left={props => <List.Icon {...props} icon={item.complete ? 'check' : 'cancel'} />}
        right={props => (
          <List.Icon
            {...props}
            icon="delete"
            onPress={() =>
              Alert.alert(
                'Xác nhận xoá',
                `Bạn có chắc muốn xoá công việc "${item.title}" không?`,
                [
                  { text: 'Huỷ', style: 'cancel' },
                  { text: 'Xoá', style: 'destructive', onPress: () => deleteTodo(item.id) },
                ]
              )
            }
          />
        )}
      />
    );
  };

  if (loading) return null;

  return (
    <View style={{ flex: 1 }}>
      <Appbar style={styles.appbar}>
        <Appbar.Content title="TODOs List" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="dots-vertical" color="white" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item onPress={handleLogout} title="Đăng xuất" />
          <Menu.Item onPress={handleChangePassword} title="Đổi mật khẩu" />
        </Menu>
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <TextInput
        label="New Todo"
        value={todo}
        onChangeText={setTodo}
        style={styles.input}
      />
      <Button mode="contained" onPress={addTodo} style={styles.button}>
        Add TODO
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  appbar: { backgroundColor: '#7c3aed' },
  input: { margin: 8 },
  button: { margin: 8 },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
});

export default TODOListScreen;