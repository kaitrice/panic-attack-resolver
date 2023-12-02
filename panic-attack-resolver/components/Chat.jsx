import React, { useState, useEffect, useRef } from 'react';
import {
    FlatList,
    Button,
    Text,
    TextInput,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import axios from 'axios'; // Import axios

const Chat = () => {
    const systemMessage = {
        "role": 'system',
        "content": "The assistant is a cognitive behavioral therapist specializing in panic disorder with 20 years of experience. The assistant helps the user get through their panic attacks by reassuring them everything will be okay, helping them talk through catastrophic thoughts, and walking them through exercises that will deescalate the panic attack. Keep responses very concise and brief.",
    };
    const [userInput, setCurrentInput] = useState('');
    const [chatHistory, setMessages] = useState([systemMessage]);
    const flatListRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputAreaHeight, setInputAreaHeight] = useState(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                // Scroll to end of FlatList
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [chatHistory]);

    const handleSend = async () => {
        const userMessage = {
            "role": 'user',
            "content": userInput,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setCurrentInput('');
        startLoadingMessage();
        const botMessage = await getBotResponse([...chatHistory, userMessage]);
        stopLoadingMessage();
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    let loadingInterval = null;

    const startLoadingMessage = () => {
        const messages = [".. ", "...", ".  "];
        let messageIndex = 0;
    
        setMessages(prevMessages => [...prevMessages, { role: 'loading', content: '.  ' }]);
    
        loadingInterval = setInterval(() => {
            const newContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
    
            // Update the content of the loading message in chat history
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const loadingMessageIndex = newMessages.findIndex(m => m.role === 'loading');
                if (loadingMessageIndex !== -1) {
                    newMessages[loadingMessageIndex] = { role: 'loading', content: newContent };
                }
                return newMessages;
            });
        }, 500); // Adjust the interval as needed
    };
    
    const stopLoadingMessage = () => {
        clearInterval(loadingInterval);
    
        // Remove the loading message from chat history
        setMessages(prevMessages => prevMessages.filter(m => m.role !== 'loading'));
    };


    const getBotResponse = async (messages) => {
        console.log(messages);
        try {
            const response = await axios.post(
                'https://panicpal.azurewebsites.net/api/PanicPal?code=o3_4CaEJP8c1jTBF2CUeUSlnwlj8oDwSrK6jiuG4ZPHnAzFuUUyCIg==',
                {

                    messages: messages,
                }
            );
            console.log(response.data);
            return response.data;

        } catch (error) {
            console.error('Error getting bot response: ', error);
            return {
                "role": 'assistant',
                "content": "I can't connect to Azure",
            };
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingBottom: keyboardHeight + 100 }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
        >
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                extraData={chatHistory}
                keyExtractor={(item, index) => index.toString()}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={{ paddingBottom: inputAreaHeight }}
                renderItem={({ item }) => {
                    // Check if the message role is 'user' and apply the userMessage style
                    if (item.role === 'user') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={[styles.userMessage, { marginLeft: 'auto' }]}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                        // Otherwise, assume it's an 'assistant' message and apply the assistantMessage style
                    } else if (item.role === 'assistant') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={styles.assistantMessage}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                    } else if (item.role === 'loading') {
                        return (
                            <View style={styles.messageContainer}>
                                <View style={styles.assistantMessage}>
                                    <Text>{item.content}</Text>
                                </View>
                            </View>
                        );
                    } else {
                        // Don't render system messages
                        return null;
                    }
                }}
            />
            <View style={styles.inputAreaContainer}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setInputAreaHeight(height);
                }}
            >
                <TextInput
                    style={styles.input}
                    value={userInput}
                    onChangeText={setCurrentInput}
                    placeholder="Type your message here..."
                />
                {/* The Button component in React Native does not accept the style prop.
                    If you want to style the button, consider using a TouchableOpacity or similar. */}
                <Button title='Send' onPress={handleSend} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: '100%', // Explicitly set the width to be 100% of the screen
    },
    inputAreaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
        marginRight: 10, // Add space between the input and the send button
    },
    messageContainer: {
        flexDirection: 'row',
        width: '100%',
        // paddingBottom: keyboardHeight + 100,
    },
    userMessage: {
        padding: 10,
        backgroundColor: '#b3c97b95',
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%', // Taking up to 80% of the container width
        // No marginLeft needed since the container itself will fill the screen width
    },
    assistantMessage: {
        padding: 10,
        backgroundColor: '#ffbac995',
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%', // Taking up to 80% of the container width
        // No marginRight needed for the same reason
    },
});

export default Chat;
