export const commands = {
    help: {
        description: 'List all available commands',
        usage: 'help',
        fn: () => {
            return `
Available commands:
  help            - Show this help message
  ls              - List files in current directory
  cd <file>       - Open a file (e.g., 'cd About.py')
  cat <file>      - Print file content to terminal
  whoami          - Display current user info
  clear           - Clear the terminal output
  theme <name>    - Switch theme (dracula, light, matrix)
  repo            - Open GitHub repository
      `;
        }
    },
    ls: {
        description: 'List files',
        usage: 'ls',
        fn: () => {
            return 'Home.md  About.py  Skills.json  Projects.ipynb  Contact.css';
        }
    },
    whoami: {
        description: 'Current user',
        usage: 'whoami',
        fn: () => {
            return 'User: Karnav Prajapati (Admin)\nRole: Machine Learning Engineer\nLocation: Ahmedabad, India';
        }
    },
    repo: {
        description: 'Open GitHub Repo',
        usage: 'repo',
        fn: () => {
            window.open('https://github.com/Karnav018', '_blank');
            return 'Opening GitHub repository...';
        }
    }
};

export const parseCommand = (input, { setTab, setTheme, clearHistory }) => {
    const args = input.trim().split(' ');
    const cmd = args[0].toLowerCase();

    if (cmd === 'clear') {
        clearHistory();
        return null;
    }

    if (cmd === 'cd' || cmd === 'open') {
        const file = args[1];
        const map = {
            'home': 'Home.md', 'home.md': 'Home.md',
            'about': 'About.py', 'about.py': 'About.py',
            'skills': 'Skills.json', 'skills.json': 'Skills.json',
            'projects': 'Projects.ipynb', 'projects.ipynb': 'Projects.ipynb',
            'contact': 'Contact.css', 'contact.css': 'Contact.css'
        };
        if (map[file?.toLowerCase()]) {
            setTab(map[file.toLowerCase()]);
            return `Opened ${map[file.toLowerCase()]}`;
        } else {
            return `File not found: ${file}. Try 'ls' to see files.`;
        }
    }

    if (cmd === 'theme') {
        const themeName = args[1]?.toLowerCase();
        if (['dracula', 'light', 'matrix'].includes(themeName)) {
            setTheme(themeName);
            return `Theme switched to ${themeName}`;
        } else {
            return `Unknown theme: ${themeName}. Available: dracula, light, matrix`;
        }
    }

    if (cmd === 'sudo') {
        const subCmd = args[1]?.toLowerCase();
        if (subCmd === 'login') {
            return { type: 'ACTION', action: 'LOGIN_PROMPT' };
        }
        if (subCmd === 'logout') {
            return { type: 'ACTION', action: 'LOGOUT' };
        }
        return "Usage: sudo login | sudo logout";
    }

    if (commands[cmd]) {
        return commands[cmd].fn();
    }

    const result = `Command not found: ${cmd}. Type 'help' for available commands.`;
    return result;
};
