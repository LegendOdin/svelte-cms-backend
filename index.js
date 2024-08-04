const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/sveltecms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: String,
});

const SettingSchema = new mongoose.Schema({
    siteTitle: String,
    siteDescription: String,
    themeColor: String,
});

const PageSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Page = mongoose.model('Page', PageSchema);
const User = mongoose.model('User', UserSchema);
const Setting = mongoose.model('Setting', SettingSchema);

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/users', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
});

app.get('/settings', async (req, res) => {
    const settings = await Setting.findOne();
    res.json(settings);
});

app.post('/settings', async (req, res) => {
    const newSettings = new Setting(req.body);
    await newSettings.save();
    res.json(newSettings);
});

app.put('/settings', async (req, res) => {
    const updatedSettings = await Setting.findOneAndUpdate({}, req.body, { new: true });
    res.json(updatedSettings);
});

app.post('/pages', async (req, res) => {
    const newPage = new Page(req.body);
    await newPage.save();
    res.json(newPage);
});

app.get('/pages', async (req, res) => {
    const pages = await Page.find();
    res.json(pages);
});

app.put('/pages/:id', async (req, res) => {
    const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPage);
});

app.delete('/pages/:id', async (req, res) => {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

