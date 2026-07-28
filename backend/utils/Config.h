#ifndef CONFIG_H
#define CONFIG_H

#include <string>

class Config {
public:
    Config();

    bool load(const std::string& filename);

    int getServerPort() const;
    std::string getLogLevel() const;
    std::string getDataPath() const;

private:
    int serverPort;
    std::string logLevel;
    std::string dataPath;
};

#endif