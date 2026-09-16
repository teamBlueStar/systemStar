#include "Config.h"

Config::Config()
    : serverPort(5000),
      logLevel("INFO"),
      dataPath("database/")
{
}

bool Config::load(const std::string& filename)
{
    (void)filename;   // temporalmente no se utiliza
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
