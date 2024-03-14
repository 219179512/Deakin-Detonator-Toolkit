# 🧰 Deakin Detonator Toolkit

This repo houses the new version of the Deakin Detonator Toolkit application built with Modern Web technologies, shipping as a native desktop application.

-   UI built with [Mantine](https://mantine.dev), [ReactJS](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/).
-   Shipped as desktop client via [Tauri](https://tauri.app/).
-   GUI exhibition will be available here: http://34.129.77.178:8080 (Deakin Intranet Only)

`src/` contains the source code for the UI.
`src-tauri` contains the source code and configuration for the Tauri application.

# 🛠️ Exploit Development

All exploit scripts are expected to live in `/usr/share/ddt/`, and they will be executed by the Tauri application. It is recommended that you use Python for exploit development.

For the exploit scripts, it is important to ensure they are executable entirely with command line arguments, eg. `python3 my_exploit.py <ip> <port>`. This will simplify the integration of the exploit into the Tauri application.

`install_exploits.sh` is a helper script that will install all the exploit scripts in the `/usr/share/ddt/` directory. If you add new exploits, be sure to run this command again.

```bash
./install_exploits.sh
```

The `.deb` that Tauri builds will automatically do this for us for actual toolkit installation.

# 🔧 Setup

To install Deakin Detonator Toolkit on Kali, you can follow either the new or old methods. The new method is a one&#8209;step process that utilises a Python script. If that doesn't work, the old method will take you through the steps manually. 

## New method

1. Run the following command:

    ```
    curl -sSL https://raw.githubusercontent.com/Hardhat-Enterprises/Deakin-Detonator-Toolkit/main/install-update-media/install-ddt.py -o install-ddt.py && python3 install-ddt.py
    ```
## Old method

1. Use this method if you get errors with the new method. Update your Kali:

    ```bash
    sudo apt update
    ```

3. Upgrade your Kali:

    ```bash
    sudo apt upgrade --fix-missing -y
    ```

4. Install missing dependencies:

    ```bash
    sudo apt install libwebkit2gtk-4.0-dev \
        build-essential \
        curl \
        wget \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev \
        dsniff \
    	dnsmap \
    	goldeneye \
    	arjun \
    	parsero \
    	sherlock \
    	foremost \
        bed
    ```

5. Close your current terminal and open a new one.

6. Install Rust:

    ```bash
    curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
    ```

7. Install Volta or Node. Volta now no longer support Apple silicon chip series (M series). Therefore we can use an alternative like Node instead:

    ### for Apple silicon series user

    ```bash
    sudo apt install nodejs npm
    ```

    ### for Windows machine with Intel/AMD

    ```bash
    curl https://get.volta.sh | bash
    ```

8. Close your current terminal and open a new one.

9. Install Node:

    ### for Apple silicon series user

    ```bash
    npm install node
    ```

    ### for Windows machine with Intel/AMD

    ```bash
    volta install node
    ```

10. Install Yarn:

    ### for Apple silicon series user

    ```bash
    npm install yarn
    ```

    ### for Windows machine with Intel/AMD

    ```bash
    volta install yarn
    ```

11. Clone the repo:

    ```bash
    git clone https://github.com/Hardhat-Enterprises/Deakin-Detonator-Toolkit
    ```

12. Change current directory to the toolkit:

    ```bash
    cd Deakin-Detonator-Toolkit
    ```

13. Install project dependencies:

    ```bash
    yarn install
    ```

14. Run the application (dev mode):

    ```bash
    $ yarn run tauri dev
    ```

# 📷 Screenshot

Once you have successfully implemented either method one or two, the application should open and look like the following screenshot: 

<img src="https://github.com/Hardhat-Enterprises/Deakin-Detonator-Toolkit/blob/main/static/ddt_homepage.png" width="1000px">

# 📷 Release

1. Change the version number in scr-tauri/tauri.conf.json larger than current version

2. Merge the main branch into release branch, it will trigger the CD pipeline to update the repo release info

3. The update information will appear when user open the app

<img src="https://github.com/Hardhat-Enterprises/Deakin-Detonator-Toolkit/blob/main/static/Updater.png" width="1000px">
