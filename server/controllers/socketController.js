const { Server } = require("socket.io");
const User = require("../models/User");

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    const roomPlayers = {};

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", async (data) => {
            socket.join(data.room);
            socket.username = data.user;

            if (!roomPlayers[data.room]) {
                roomPlayers[data.room] = [];
            }
            if (!roomPlayers[data.room].includes(data.user)) {
                roomPlayers[data.room].push(data.user);
            }

            io.to(data.room).emit("update_player_list", roomPlayers[data.room]);
        });

        socket.on("send_message", (data) => {
            io.to(data.room).emit("receive_message", {
                username: data.username,
                message: data.message,
            });
        });

        socket.on("start_game", (data) => {
            io.to(data.room).emit("navigate_to_game");
        });

        socket.on("answer_clicked", async (data) => {
            const scoreToAdd = data.isCorrect ? 100 : 0;

            const user = await User.findOneAndUpdate(
                { username: data.clickedBy },
                { $inc: { total_score: scoreToAdd } },
                { new: true }
            );

            if (user) {
                io.to(data.room).emit("score_updated", {
                    user: data.clickedBy,
                    score: user.total_score,
                });
            }
        });

        socket.on("update_score", async ({ user, score, room }) => {
            const userDoc = await User.findOneAndUpdate(
                { username: user },
                { $set: { total_score: score } },
                { new: true }
            );

            io.to(room).emit("score_updated", {
                user: user,
                score: userDoc.total_score,
            });
        });

        socket.on("create_questions", (data) => {
            io.to(data.room).emit("questions_created", data);
        });

        socket.on("disconnecting", () => {
            const rooms = Array.from(socket.rooms).filter((item) => item !== socket.id);

            rooms.forEach((room) => {
                const username = socket.username;
                const index = roomPlayers[room].indexOf(username);
                if (index !== -1) {
                    roomPlayers[room].splice(index, 1);
                    io.to(room).emit("update_player_list", roomPlayers[room]);
                }
            });
        });
    });

    return io;
}

module.exports = setupSocket;
