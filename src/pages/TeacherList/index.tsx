import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

import styles from './styles';

// UTILIZAR O PICKER do React/Expo

function TeacherList() {

    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [weekday, setWeekday] = useState('');
    const [time, setTime] = useState('');

    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacherItem: Teacher) => {
                        return teacherItem.id;
                    });
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    function handleToggleFiltersVisible() {
        setIsFilterVisible(!isFilterVisible);
    }

    async function handleFilterSubmit() {
        loadFavorites();

        const response = await api.get('/classes', {
            params: {
                subject,
                weekday,
                time
            }
        });

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                            value = {subject}
                            onChangeText = {text => setSubject(text)}
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock} >
                                <Text style={styles.label}>Dia da Semana</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#c1bccc"
                                    value = {weekday}
                                    onChangeText = {text => setWeekday(text)}
       
                                />
                            </View>

                            <View style={styles.inputBlock} >
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o horário?"
                                    placeholderTextColor="#c1bccc"
                                    value = {time}
                                    onChangeText = {text => setTime(text)}
                                />
                            </View>
                        </View>
                        <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
                            <Text style={styles.submitButtonText} >Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
            }}>
                {teachers.map( (teacher: Teacher) => {
                                    return (
                                        <TeacherItem 
                                            key={teacher.id} 
                                            teacher={teacher}
                                            favorited={favorites.includes(teacher.id)}
                                        />
                                    );
                                }
                )}
            </ScrollView>
        </View>
    );
}

export default TeacherList;