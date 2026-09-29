#include "Config.h"

#include <fstream>
#include <string>

namespace {

std::string trim(const std::string& value)
{
    const std::string whitespace = " \t\r\n";

    const std::size_t first = value.find_first_not_of(whitespace);

    if (first == std::string::npos) {
        return "";
    }

    const std::size_t last = value.find_last_not_of(whitespace);

    return value.substr(first, last - first + 1);
}

bool parsePort(const std::string& value, int& port)
{
    try {
        std::size_t position = 0;
        const int parsed = std::stoi(value, &position);

        if (position != value.size()) {
            return false;
        }

        if (parsed < 1 || parsed > 65535) {
            return false;
        }

        port = parsed;

        return true;
    }
    catch (...) {
        return false;
    }
}

} // namespace

Config::Config()
    : serverPort(5000),
      logLevel("INFO"),
      dataPath("database/")
{
}

bool Config::load(const std::string& filename)
{
    std::ifstream file(filename);

    if (!file.is_open()) {
        return false;
    }

    int newServerPort = serverPort;

    std::string currentSection;
    std::string line;

    while (std::getline(file, line)) {
        line = trim(line);

        if (line.empty()) {
            continue;
        }

        if (line[0] == '#') {
            continue;
        }

        if (line.front() == '[' && line.back() == ']') {
            currentSection = trim(
                line.substr(1, line.size() - 2)
            );

            continue;
        }

        const std::size_t separator = line.find('=');

        if (separator == std::string::npos) {
            return false;
        }

        const std::string key = trim(
            line.substr(0, separator)
        );

        const std::string value = trim(
            line.substr(separator + 1)
        );

        if (key.empty()) {
            return false;
        }

        if (currentSection == "server" &&
            key == "tcp_port") {

            int parsedPort = 0;

            if (!parsePort(value, parsedPort)) {
                return false;
            }

            newServerPort = parsedPort;
        }
    }

    if (file.bad()) {
        return false;
    }

    serverPort = newServerPort;

    return true;
}

int Config::getServerPort() const
{
    return serverPort;
}

std::string Config::getLogLevel() const
{
    return logLevel;
}

std::string Config::getDataPath() const
{
    return dataPath;
}
