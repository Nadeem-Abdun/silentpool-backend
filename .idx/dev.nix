{ pkgs }: {
  # Use the stable nixpkgs channel
  channel = "stable-24.05";

  # Required packages for the backend project
  packages = [
    pkgs.nodejs_20           # Node.js 20 for running the project
    pkgs.nodePackages.nodemon # Nodemon for auto-reloading
  ];

  # Set environment variables if needed
  env = {
    NODE_ENV = "development"; # Default to development mode
  };

  idx = {
    # Relevant VS Code extensions
    extensions = [
      "dbaeumer.vscode-eslint" # ESLint for code linting
      "esbenp.prettier-vscode" # Prettier for consistent code formatting
    ];

    # Enable previews and define how to start the backend server
    previews = {
      enable = true;
      previews = {
        api = {
          # Command to start the backend
          command = [
            "npm"
            "run"
            "start"
          ];
          env = {
            PORT = "$PORT"; # Use IDX's defined port
          };
          manager = "web";
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Run when a workspace is created (install dependencies)
      onCreate = {
        install-dependencies = "npm install";
      };
      # Run when the workspace starts (start the server)
      onStart = {
        start-backend = "npm run dev";
      };
    };
  };
}
