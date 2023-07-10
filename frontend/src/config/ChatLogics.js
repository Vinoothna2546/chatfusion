export const isSameSenderMargin = (Messages, m, i, userId) => {
    // console.log(i === Messages.length - 1);

    if (
        i < Messages.length - 1 &&
        Messages[i + 1].sender._id === m.sender._id &&
        Messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < Messages.length - 1 &&
            Messages[i + 1].sender._id !== m.sender._id &&
            Messages[i].sender._id !== userId) ||
        (i === Messages.length - 1 && Messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (Messages, m, i, userId) => {
    return (
        i < Messages.length - 1 &&
        (Messages[i + 1].sender._id !== m.sender._id ||
            Messages[i + 1].sender._id === undefined) &&
        Messages[i].sender._id !== userId
    );
};

export const isLastMessage = (Messages, i, userId) => {
    return (
        i === Messages.length - 1 &&
        Messages[Messages.length - 1].sender._id !== userId &&
        Messages[Messages.length - 1].sender._id
    );
};

export const isSameUser = (Messages, m, i) => {
    return i > 0 && Messages[i - 1].sender._id === m.sender._id;
};