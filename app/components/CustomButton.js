import { Text, Pressable, StyleSheet } from "react-native";

export const CustomButton = (props) => {
    return (
        <Pressable onPress={props.onButtonPress} style={[styles.buttonCase, {borderColor: props.buttonColor, backgroundColor: props.buttonColor}]}>
            <Text style={[styles.innerText, {color: props.textColor}]}>{props.text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonCase: {
        borderWidth: 1,
        width: "100%",
        height: 40,
        alignSelf: 'center',
        color: 'white',
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
        verticalAlign: 'center',
    },
    innerText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center',
        marginTop: 5,
        fontWeight: 'bold'
    },
});