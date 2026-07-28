#include "Config.h"

Config::Config() {
    serverPort = 5000;
    logLevel = "INFO";
}

bool Config::load(const std::string&) {
    // Temporalmente no hace nada
    return true;
}

int Config::getServerPort() const {
    return serverPort;
}

std::string Config::getLogLevel() const {
    return logLevel;
}